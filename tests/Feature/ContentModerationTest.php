<?php

namespace Tests\Feature;

use App\Models\Agent;
use App\Models\Products;
use App\Models\Store;
use App\Models\User;
use App\Rules\CleanText;
use App\Rules\SafeImage;
use App\Services\ProfanityFilterService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class ContentModerationTest extends TestCase
{
    use RefreshDatabase;

    public function test_profanity_filter_detects_english_profanities(): void
    {
        $service = app(ProfanityFilterService::class);

        $this->assertTrue($service->containsProfanity('This is fucking unacceptable'));
        $this->assertTrue($service->containsProfanity('You are a bitch'));
        $this->assertTrue($service->containsProfanity('Shut up asshole'));
        $this->assertTrue($service->containsProfanity('This store sells sex products'));
        $this->assertTrue($service->containsProfanity('Hot and sexy girl'));
        $this->assertTrue($service->containsProfanity('s*x item'));
        $this->assertTrue($service->containsProfanity('bikini swimwear'));

        // Does NOT flag safe words containing substrings like "ass" or "sex"
        $this->assertFalse($service->containsProfanity('This is a classic leather wallet'));
        $this->assertFalse($service->containsProfanity('Digital asset and inventory management'));
        $this->assertFalse($service->containsProfanity('Glass bottle 500ml'));
        $this->assertFalse($service->containsProfanity('Beautiful cotton dress with buttons'));
        $this->assertFalse($service->containsProfanity('Unisex winter cotton hoodie'));
        $this->assertFalse($service->containsProfanity('Unisex sunglasses UV protection'));
    }

    public function test_profanity_filter_detects_bengali_and_banglish(): void
    {
        $service = app(ProfanityFilterService::class);

        // Bengali script profanity
        $this->assertTrue($service->containsProfanity('তুই একটা বোকাচোদা'));
        $this->assertTrue($service->containsProfanity('এই মাগি টা ভালো না'));
        $this->assertTrue($service->containsProfanity('খানকির পোলা ডেলিভারি দে'));
        $this->assertTrue($service->containsProfanity('বালের প্রোডাক্ট দিছে'));
        $this->assertTrue($service->containsProfanity('এই বাল পছন্দ হয়নি'));

        // Spaced Bengali evasion attempts
        $this->assertTrue($service->containsProfanity('বো কা চো দা'));
        $this->assertTrue($service->containsProfanity('ম া গ ী'));

        // Banglish transliteration
        $this->assertTrue($service->containsProfanity('tui ekta bokachoda'));
        $this->assertTrue($service->containsProfanity('kuttar baccha dokan'));
        $this->assertTrue($service->containsProfanity('madarchod seller'));
        $this->assertTrue($service->containsProfanity('baler service'));
        $this->assertTrue($service->containsProfanity('haramjada seller'));

        // Safe Bengali words (MUST NOT be false-flagged)
        $this->assertFalse($service->containsProfanity('খুব সুন্দর প্রোডাক্ট, ধন্যবাদ'));
        $this->assertFalse($service->containsProfanity('অসাধারণ সার্ভিস ও দ্রুত ডেলিভারি'));
        $this->assertFalse($service->containsProfanity('ইকবাল হোসেন এর দোকান'));
        $this->assertFalse($service->containsProfanity('সুন্দর বালিশ কাভার'));
        $this->assertFalse($service->containsProfanity('প্লাস্টিক বালতি ২০ লিটার'));
        $this->assertFalse($service->containsProfanity('বালক ও বালিকা পোশাক'));
    }

    public function test_profanity_filter_handles_leetspeak_and_symbol_obfuscation(): void
    {
        $service = app(ProfanityFilterService::class);

        $this->assertTrue($service->containsProfanity('f*ck this seller'));
        $this->assertTrue($service->containsProfanity('b!tch shop'));
        $this->assertTrue($service->containsProfanity('@sshole'));
    }

    public function test_clean_text_rule_validates_correctly(): void
    {
        $rule = new CleanText();

        $passed = true;
        $rule->validate('description', 'Great product, highly recommend!', function ($msg) use (&$passed) {
            $passed = false;
        });
        $this->assertTrue($passed);

        $failed = false;
        $errorMessage = '';
        $rule->validate('description', 'Total bullshit product fuck you', function ($msg) use (&$failed, &$errorMessage) {
            $failed = true;
            $errorMessage = $msg;
        });
        $this->assertTrue($failed);
        $this->assertStringContainsString('inappropriate or offensive language', $errorMessage);
    }

    public function test_safe_image_rule_flags_inappropriate_content(): void
    {
        $rule = new SafeImage();

        // 1. Safe image mock annotation
        SafeImage::$mockAnnotation = [
            'adult' => 'VERY_UNLIKELY',
            'violence' => 'VERY_UNLIKELY',
            'racy' => 'UNLIKELY',
        ];

        $passed = true;
        $rule->validate('logo', 'dummy_path.jpg', function ($msg) use (&$passed) {
            $passed = false;
        });
        $this->assertTrue($passed);

        // 2. Adult content flagged
        SafeImage::$mockAnnotation = [
            'adult' => 'LIKELY',
            'violence' => 'VERY_UNLIKELY',
            'racy' => 'LIKELY',
        ];

        $failed = false;
        $errorMessage = '';
        $rule->validate('logo', 'dummy_path.jpg', function ($msg) use (&$failed, &$errorMessage) {
            $failed = true;
            $errorMessage = $msg;
        });
        $this->assertTrue($failed);
        $this->assertStringContainsString('explicit or adult content', $errorMessage);

        // 3. Violent content flagged
        SafeImage::$mockAnnotation = [
            'adult' => 'VERY_UNLIKELY',
            'violence' => 'VERY_LIKELY',
            'racy' => 'VERY_UNLIKELY',
        ];

        $failedViolence = false;
        $violenceMessage = '';
        $rule->validate('image', 'dummy_path.jpg', function ($msg) use (&$failedViolence, &$violenceMessage) {
            $failedViolence = true;
            $violenceMessage = $msg;
        });
        $this->assertTrue($failedViolence);
        $this->assertStringContainsString('violent or graphic content', $violenceMessage);

        // 4. Bikini / revealing swimwear label flagged
        SafeImage::$mockAnnotation = null;
        SafeImage::$mockLabels = [
            ['description' => 'Bikini', 'score' => 0.95],
            ['description' => 'Undergarment', 'score' => 0.88],
        ];

        $failedBikini = false;
        $bikiniMessage = '';
        $rule->validate('image', 'dummy_bikini.jpg', function ($msg) use (&$failedBikini, &$bikiniMessage) {
            $failedBikini = true;
            $bikiniMessage = $msg;
        });
        $this->assertTrue($failedBikini);
        $this->assertStringContainsString('bikini', $bikiniMessage);

        // 5. Racy content (suggestive / scantily clad / swimsuit) flagged
        SafeImage::$mockLabels = null;
        SafeImage::$mockAnnotation = [
            'adult' => 'VERY_UNLIKELY',
            'violence' => 'VERY_UNLIKELY',
            'racy' => 'LIKELY',
        ];

        $failedRacy = false;
        $racyMessage = '';
        $rule->validate('image', 'dummy_racy.jpg', function ($msg) use (&$failedRacy, &$racyMessage) {
            $failedRacy = true;
            $racyMessage = $msg;
        });
        $this->assertTrue($failedRacy);
        $this->assertStringContainsString('bikini, revealing, or adult suggestive', $racyMessage);

        // 6. Sex toy image label flagged (e.g. Dildo / Vibrator / Sex toy)
        SafeImage::$mockAnnotation = null;
        SafeImage::$mockLabels = [
            ['description' => 'Dildo', 'score' => 0.92],
            ['description' => 'Sex toy', 'score' => 0.89],
        ];

        $failedSexToy = false;
        $sexToyMessage = '';
        $rule->validate('images.0', 'dummy_sextoy.jpg', function ($msg) use (&$failedSexToy, &$sexToyMessage) {
            $failedSexToy = true;
            $sexToyMessage = $msg;
        });
        $this->assertTrue($failedSexToy);
        $this->assertStringContainsString('sex toys', $sexToyMessage);

        // 7. Nude profile photo flagged
        SafeImage::$mockLabels = null;
        SafeImage::$mockAnnotation = [
            'adult' => 'VERY_LIKELY',
            'violence' => 'VERY_UNLIKELY',
            'racy' => 'VERY_LIKELY',
        ];

        $failedNude = false;
        $nudeMessage = '';
        $rule->validate('image', 'dummy_nude_avatar.jpg', function ($msg) use (&$failedNude, &$nudeMessage) {
            $failedNude = true;
            $nudeMessage = $msg;
        });
        $this->assertTrue($failedNude);
        $this->assertStringContainsString('Nude or sexually explicit photos are strictly forbidden', $nudeMessage);

        // Reset mock annotation & labels
        SafeImage::$mockAnnotation = null;
        SafeImage::$mockLabels = null;
    }

    private function createProduct(User $user, Store $store): Products
    {
        return Products::create([
            'user_id' => $user->id,
            'store_id' => $store->id,
            'name' => 'Leather Wallet',
            'images' => 'test.jpg',
            'slug' => 'test-product-' . uniqid(),
            'category' => 'Fashion',
            'subcategory' => 'Wallets',
            'brand' => 'HaatPoint',
            'regular_price' => 500,
            'description' => 'Test product description',
            'item_weight' => '0.5',
            'quantity' => 10,
        ]);
    }

    public function test_comment_submission_rejects_profanity(): void
    {
        $user = User::factory()->create();
        $store = Store::create([
            'user_id' => $user->id,
            'name' => 'Store ' . uniqid(),
            'email' => uniqid() . '@example.com',
            'address' => 'Dhaka',
            'mobile' => '017' . rand(10000000, 99999999),
            'storetype' => 'general',
            'national_id' => '1234567890' . rand(1000, 9999),
            'is_active' => true,
        ]);
        $product = $this->createProduct($user, $store);

        $response = $this->actingAs($user)->post(route('comments.store'), [
            'product_id' => $product->id,
            'comment' => 'This product is pure shit and fuck this seller',
            'rating' => 1,
        ]);

        $response->assertSessionHasErrors(['comment']);

        // Bengali bad word in comment
        $responseBengali = $this->actingAs($user)->post(route('comments.store'), [
            'product_id' => $product->id,
            'comment' => 'একদম বালের প্রোডাক্ট দিছে, ফালতু সেলার',
            'rating' => 1,
        ]);

        $responseBengali->assertSessionHasErrors(['comment']);
    }

    public function test_comment_submission_accepts_clean_text(): void
    {
        $user = User::factory()->create();
        $store = Store::create([
            'user_id' => $user->id,
            'name' => 'Store ' . uniqid(),
            'email' => uniqid() . '@example.com',
            'address' => 'Dhaka',
            'mobile' => '017' . rand(10000000, 99999999),
            'storetype' => 'general',
            'national_id' => '1234567890' . rand(1000, 9999),
            'is_active' => true,
        ]);
        $product = $this->createProduct($user, $store);

        $response = $this->actingAs($user)->post(route('comments.store'), [
            'product_id' => $product->id,
            'comment' => 'The fabric quality is great and delivery was fast.',
            'rating' => 5,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('comments', [
            'product_id' => $product->id,
            'comment' => 'The fabric quality is great and delivery was fast.',
            'rating' => 5,
        ]);
    }

    public function test_store_creation_rejects_profanity_in_name_or_address(): void
    {
        $user = User::factory()->create();

        // 1. Profane store name
        $response = $this->actingAs($user)->post(route('stores.store'), [
            'name' => 'Bitch Store BD',
            'storetype' => 'retail',
            'address' => 'Dhanmondi, Dhaka',
            'sender_city' => 1,
            'national_id' => '1234567890',
            'mobile' => '01712345678',
        ]);

        $response->assertSessionHasErrors(['name']);

        // 2. Profane store address
        $responseAddress = $this->actingAs($user)->post(route('stores.store'), [
            'name' => 'Clean Store Name',
            'storetype' => 'retail',
            'address' => 'House 1, Road 2, bokachoda goli',
            'sender_city' => 1,
            'national_id' => '1234567890',
            'mobile' => '01712345678',
        ]);

        $responseAddress->assertSessionHasErrors(['address']);
    }

    public function test_product_creation_rejects_profanity_in_name_or_description(): void
    {
        $user = User::factory()->create();
        $store = Store::create([
            'user_id' => $user->id,
            'name' => 'Shop ' . uniqid(),
            'email' => uniqid() . '@example.com',
            'address' => 'Dhaka',
            'mobile' => '017' . rand(10000000, 99999999),
            'storetype' => 'general',
            'national_id' => '1234567890' . rand(1000, 9999),
            'is_active' => true,
        ]);

        // 1. Profane product name
        $response = $this->actingAs($user)->post(route('products.store'), [
            'store_id' => $store->id,
            'name' => 'Horny Sexy Porn dress',
            'slug' => 'horny-sexy-porn-dress',
            'category' => 'Fashion',
            'quantity' => 10,
            'regular_price' => 500,
            'description' => 'A nice dress for ladies',
            'item_weight' => 0.5,
            'product_type' => 'regular',
        ]);

        $response->assertSessionHasErrors(['name']);

        // 2. Profane product description
        $responseDesc = $this->actingAs($user)->post(route('products.store'), [
            'store_id' => $store->id,
            'name' => 'Red Summer Dress',
            'slug' => 'red-summer-dress',
            'category' => 'Fashion',
            'quantity' => 10,
            'regular_price' => 500,
            'description' => 'This is total motherfucker quality dress',
            'item_weight' => 0.5,
            'product_type' => 'regular',
        ]);

        $responseDesc->assertSessionHasErrors(['description']);
    }

    public function test_product_creation_rejects_sex_toys_and_adult_items(): void
    {
        $user = User::factory()->create();
        $store = Store::create([
            'user_id' => $user->id,
            'name' => 'Shop ' . uniqid(),
            'email' => uniqid() . '@example.com',
            'address' => 'Dhaka',
            'mobile' => '017' . rand(10000000, 99999999),
            'storetype' => 'general',
            'national_id' => '1234567890' . rand(1000, 9999),
            'is_active' => true,
        ]);

        // 1. English "Sex Toys" name
        $responseSexToy = $this->actingAs($user)->post(route('products.store'), [
            'store_id' => $store->id,
            'name' => 'Silicone Vibrator and Dildo Set',
            'slug' => 'silicone-vibrator-dildo-set',
            'category' => 'Adult Novelties',
            'quantity' => 5,
            'regular_price' => 1500,
            'description' => 'Rechargeable adult toy for personal pleasure',
            'item_weight' => 0.5,
            'product_type' => 'regular',
        ]);
        $responseSexToy->assertSessionHasErrors(['name']);

        // 2. Bangla "সেক্স টয়" category
        $responseBanglaSexToy = $this->actingAs($user)->post(route('products.store'), [
            'store_id' => $store->id,
            'name' => 'Pleasure Device',
            'slug' => 'pleasure-device',
            'category' => 'সেক্স টয়',
            'quantity' => 5,
            'regular_price' => 1500,
            'description' => 'Electric adult massage product',
            'item_weight' => 0.5,
            'product_type' => 'regular',
        ]);
        $responseBanglaSexToy->assertSessionHasErrors(['category']);

        // 3. Butt plug in description
        $responsePlug = $this->actingAs($user)->post(route('products.store'), [
            'store_id' => $store->id,
            'name' => 'Metallic Decor Novelty',
            'slug' => 'metallic-decor-novelty',
            'category' => 'General',
            'quantity' => 5,
            'regular_price' => 1500,
            'description' => 'Crystal butt plug with silicone base',
            'item_weight' => 0.5,
            'product_type' => 'regular',
        ]);
        $responsePlug->assertSessionHasErrors(['description']);
    }

    public function test_store_creation_rejects_sex_shop_storetype(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('stores.store'), [
            'name' => 'Pleasure Paradise BD',
            'storetype' => 'Sex Toy Store',
            'address' => 'Gulshan 2, Dhaka',
            'sender_city' => 1,
            'national_id' => '1234567890',
            'mobile' => '01712345678',
        ]);

        $response->assertSessionHasErrors(['storetype']);
    }
}
