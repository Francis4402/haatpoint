<?php

namespace Database\Seeders;

use App\Models\Categories;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class CategoriesSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $categories = [
            [
                'name' => 'Electronics',
                'brands' => ['Samsung', 'Sony', 'LG', 'Walton', 'Xiaomi', 'Realme', 'OnePlus', 'Toshiba', 'Panasonic', 'Sharp'],
                'subcategories' => ['Mobile Phones', 'Tablets', 'Laptops', 'Desktop Computers', 'Smartwatches', 'Headphones & Earbuds', 'Speakers', 'Chargers & Cables', 'Power Banks', 'Memory Cards', 'Routers & Modems', 'Printers', 'Computer Accessories'],
            ],
            [
                'name' => 'TV & Audio',
                'brands' => ['Samsung', 'Sony', 'LG', 'Walton', 'Xiaomi', 'Toshiba', 'Panasonic', 'JBL', 'Boat', 'Edifier'],
                'subcategories' => ['Smart TVs', 'LED TVs', 'Soundbars', 'Home Theatre Systems', 'Bluetooth Speakers', 'Television Stands', 'Remotes & Accessories', 'Projectors'],
            ],
            [
                'name' => 'Home Appliances',
                'brands' => ['Walton', 'Samsung', 'LG', 'Singer', 'Midea', 'Haier', 'Sharp', 'Konka', 'Vision', 'Janata'],
                'subcategories' => ['Refrigerators', 'Air Conditioners', 'Washing Machines', 'Microwave Ovens', 'Electric Kettles', 'Blenders & Juicers', 'Rice Cookers', 'Irons', 'Vacuum Cleaners', 'Water Heaters', 'Ceiling Fans', 'Exhaust Fans'],
            ],
            [
                'name' => "Men's Fashion",
                'brands' => ['Arong', 'Yellow', 'Ecstasy', 'Sailor', 'Cats Eye', 'Freeland', 'Richman', 'Easy', 'HelpLine', 'Le Reve'],
                'subcategories' => ['T-Shirts', 'Shirts', 'Pants & Trousers', 'Panjabi & Kurta', 'Jeans', 'Blazers & Suits', 'Sweaters & Hoodies', 'Jackets', 'Shorts', 'Underwear & Socks', 'Men\'s Sandals'],
            ],
            [
                'name' => "Women's Fashion",
                'brands' => ['Arong', 'Dorjibari', 'Anjan\'s', 'Bibiana', 'Kazi Kena', 'Shatarupa', 'Tangail Sharee', 'Nurjahan', 'Rang', 'Faasos'],
                'subcategories' => ['Sharie', 'Salwar Kameez', 'Tops & Blouses', 'Dresses', 'Kurtis', 'Hijabs', 'Dupattas', 'Sarees', 'Leggings & Palazzos', 'Maternity Wear', 'Women\'s Sandals'],
            ],
            [
                'name' => "Kids' Fashion",
                'brands' => ['Yellow', 'Ecstasy', 'Gabbana', 'Chic To Chic', 'Cutie Pie', 'Chimney', 'Apple Kids', 'Baby Club', 'Footer'],
                'subcategories' => ['Boys\' T-Shirts', 'Girls\' Frocks', 'Baby Suits', 'Kids\' Jeans', 'Kids\' Shoes', 'School Uniforms', 'Kids\' Panjabi', 'Kids\' Winter Wear', 'Diapers & Accessories'],
            ],
            [
                'name' => 'Shoes & Footwear',
                'brands' => ['Bata', 'Apex', 'Lotto', 'Power', 'Rocket', 'Bay', 'Sand World', 'Khoos', 'Walker', 'Boston'],
                'subcategories' => ['Sports Shoes', 'Running Shoes', 'Formal Shoes', 'Casual Shoes', 'Sandals', 'Slippers', 'Boots', 'Heels', 'Football Boots', 'School Shoes'],
            ],
            [
                'name' => 'Bags & Luggage',
                'brands' => ['Wildcraft', 'Skybags', 'American Tourister', 'VIP', 'Safari', 'Carlton', 'Metropolitan', 'Antler', 'Dune', 'Lowepro'],
                'subcategories' => ['Backpacks', 'School Bags', 'Laptop Bags', 'Handbags', 'Tote Bags', 'Suitcases', 'Travel Bags', 'Wallets', 'Sling Bags', 'Duffel Bags'],
            ],
            [
                'name' => 'Watches & Jewelry',
                'brands' => ['Titan', 'Casio', 'Seiko', 'Fossil', 'Noise', 'Boat', 'Timex', 'Pierre Cardin', 'Kohinoor', 'Diamond World'],
                'subcategories' => ['Men\'s Watches', 'Women\'s Watches', 'Smartwatches', 'Gold Jewelry', 'Silver Jewelry', 'Bracelets', 'Necklaces', 'Rings', 'Earrings', 'Watch Accessories'],
            ],
            [
                'name' => 'Beauty & Personal Care',
                'brands' => ['L\'Oreal', 'Garnier', 'Nivea', 'Fair & Lovely', 'Himalaya', 'Pond\'s', 'Dove', 'Aveeno', 'Maybelline', 'The Face Shop'],
                'subcategories' => ['Skincare', 'Haircare', 'Makeup', 'Fragrance', 'Men\'s Grooming', 'Bath & Body', 'Sun Care', 'Beauty Tools', 'Lip Care'],
            ],
            [
                'name' => 'Health & Wellness',
                'brands' => ['Square', 'ACI', 'Unimed', 'Renata', 'Opsonin', 'Beximco', 'Panadol', 'Napa', 'Health Aid', 'Bayern'],
                'subcategories' => ['Vitamins & Supplements', 'First Aid', 'Pain Relief', 'Cough & Cold', 'Digestive Health', 'Baby Care', 'Medical Devices', 'Thermometers', 'Blood Pressure Monitors'],
            ],
            [
                'name' => 'Baby & Maternity',
                'brands' => ['Pampers', 'Huggies', 'Molfix', 'Little Angel', 'MamyPoko', 'Baby Dove', 'Chicco', 'Philips Avent', 'Goodbaby'],
                'subcategories' => ['Diapers', 'Baby Wipes', 'Baby Formula', 'Baby Clothing', 'Nursery Furniture', 'Strollers', 'Car Seats', 'Baby Toys', 'Maternity Care'],
            ],
            [
                'name' => 'Toys & Games',
                'brands' => ['Lego', 'Fisher-Price', 'Mattel', 'Barbie', 'Hot Wheels', 'Funskool', 'Ambi', 'Orbit', 'Sikkis', 'Power Rangers'],
                'subcategories' => ['Building Blocks', 'Action Figures', 'Dolls', 'Board Games', 'Remote Control Cars', 'Educational Toys', 'Puzzles', 'Outdoor Toys', 'Video Games', 'Arts & Crafts Toys'],
            ],
            [
                'name' => 'Sports & Fitness',
                'brands' => ['Cosco', 'Nivia', 'Crocodile', 'Adidas', 'Nike', 'Puma', 'Reebok', 'Yonex', 'Wilson', 'Spalding'],
                'subcategories' => ['Cricket', 'Football', 'Badminton', 'Gym Equipment', 'Yoga Mats', 'Exercise Bands', 'Dumbbells', 'Cycling', 'Swimming', 'Camping & Hiking'],
            ],
            [
                'name' => 'Automotive & Motorcycle',
                'brands' => ['Bashundhara', 'Motul', 'Mobil', 'Shell', 'Castrol', 'Yamaha', 'Honda', 'Bajaj', 'Runner', 'Hero'],
                'subcategories' => ['Engine Oil', 'Bike Helmet', 'Motorcycle Accessories', 'Car Accessories', 'Car Care', 'Tires & Tubes', 'Batteries', 'Tools & Spare Parts'],
            ],
            [
                'name' => 'Books & Stationery',
                'brands' => ['Rokomari', 'Bangla Academy', 'The Daily Star Books', 'Penguin', 'Oxford', 'Prothoma', 'Anindya', 'Sourav', 'Matador', 'BDBL'],
                'subcategories' => ['Academic Books', 'Fiction', 'Non-Fiction', 'Children\'s Books', 'Notebooks', 'Pens & Pencils', 'Art Supplies', 'Office Stationery', 'Calculators', 'Desk Organizers'],
            ],
            [
                'name' => 'Home & Living',
                'brands' => ['Hatil', 'Otobi', 'Navana', 'Partex', 'Otobi', 'Dream Furniture', 'Atelier', 'French Door', 'Better Living'],
                'subcategories' => ['Sofas', 'Beds', 'Dining Tables', 'Wardrobes', 'Bookshelves', 'Mattresses', 'Curtains', 'Carpets & Rugs', 'Home Decor', 'Lighting', 'Cushions & Covers'],
            ],
            [
                'name' => 'Kitchen & Dining',
                'brands' => ['Premier', 'Steel Works', 'Navono', 'Inox', 'Magma', 'Crown', 'Hawkins', 'Tekson', 'Faruk Ceramics', 'Monno'],
                'subcategories' => ['Cookware', 'Kitchen Knives', 'Dinner Sets', 'Cutlery', 'Storage Containers', 'Water Bottles', 'Tiffin Boxes', 'Kitchen Utensils', 'Glassware', 'Cooking Gas Accessories'],
            ],
            [
                'name' => 'Pet Supplies',
                'brands' => ['Pedigree', 'Royal Canin', 'Whiskas', 'Drools', 'Me-O', 'Hartz', 'PetMaster', 'Cricket'],
                'subcategories' => ['Pet Toys', 'Pet Grooming', 'Aquarium & Fish', 'Bird Supplies', 'Pet Beds', 'Leashes & Collars', 'Pet Health'],
            ],
            [
                'name' => 'Tools & Hardware',
                'brands' => ['Bosch', 'Stanley', 'Dewalt', 'Black+Decker', 'Ceiling', 'Super', 'Engle', 'Kango', 'Hilti'],
                'subcategories' => ['Power Tools', 'Hand Tools', 'Drills', 'Saws', 'Fasteners', 'Adhesives', 'Electrical Supplies', 'Plumbing Supplies', 'Safety Equipment', 'Tool Boxes'],
            ],
            [
                'name' => 'Garden & Outdoor',
                'brands' => ['Sajeeb', 'Pran Agro', 'Green Bangla', 'Bosch', 'McCulloch', 'Fiskars', 'Carlton'],
                'subcategories' => ['Plants & Seeds', 'Fertilizers', 'Garden Tools', 'Pots & Planters', 'Watering Systems', 'Outdoor Lighting', 'BBQ & Grills', 'Garden Furniture', 'Lawn Care'],
            ],
            [
                'name' => 'Office & Business',
                'brands' => ['HP', 'Canon', 'Brother', 'Epson', 'Avery', 'Pilot', 'BIC', 'Faber-Castell', 'Acco', 'Deli'],
                'subcategories' => ['Printers & Scanners', 'Ink & Toner', 'Paper & Labels', 'Office Chairs', 'Office Desks', 'File Storage', 'Whiteboards', 'Presentation Supplies', 'Binder & Folders'],
            ],
            [
                'name' => 'Travel & Luggage',
                'brands' => ['American Tourister', 'Safari', 'Skybags', 'Skyline', 'Reynolds', 'Hindi', 'Carlton', 'Travova'],
                'subcategories' => ['Travel Backpacks', 'Suitcases', 'Travel Accessories', 'Neck Pillows', 'Packing Organizers', 'Passport Holders', 'Travel Adapters', 'Toiletry Bags'],
            ],
            [
                'name' => 'Musical Instruments',
                'brands' => ['Yamaha', 'Casio', 'Fender', 'Gibson', 'Roland', 'Korg', 'Pearl', 'Zildjian', 'Farlight', 'Sunny'],
                'subcategories' => ['Guitars', 'Keyboards & Pianos', 'Drums & Percussion', 'Violins', 'Flutes', 'Amplifiers', 'Microphones', 'Musical Accessories', 'Effect Pedals'],
            ],
        ];

        $directory = 'category_images';

        foreach ($categories as $category) {
            $imagePath = $this->generatePlaceholderImage($directory, $category['name']);

            Categories::updateOrCreate(
                ['categories' => $category['name']],
                [
                    'brand' => json_encode($category['brands']),
                    'subcategory' => json_encode($category['subcategories']),
                    'image' => $imagePath,
                ]
            );
        }

        $this->command?->info('Categories seeded: ' . count($categories) . ' categories created.');
    }

    /**
     * Generate a placeholder webp image with the category name and persist it
     * to the public storage disk. Returns the stored relative path.
     */
    private function generatePlaceholderImage(string $directory, string $name): string
    {
        $slug = strtolower(preg_replace('/[^a-z0-9]+/i', '_', $name));
        $slug = trim($slug, '_');
        $filename = 'category_' . $slug . '.webp';
        $relativePath = $directory . '/' . $filename;

        // Skip regeneration if it already exists (keeps idempotent re-runs).
        if (Storage::disk('public')->exists($relativePath)) {
            return $relativePath;
        }

        // Prefer a real, category-relevant image; fall back to the generated placeholder.
        if ($this->downloadRelevantImage($slug, $relativePath)) {
            return $relativePath;
        }

        $width = 800;
        $height = 600;

        $img = imagecreatetruecolor($width, $height);

        // Color derived from the slug hash so each category looks distinct.
        $hue = (crc32($name) % 360);
        [$r, $g, $b] = $this->hsvToRgb($hue, 0.55, 0.75);

        $bg = imagecolorallocate($img, $r, $g, $b);

        // Soft darker shade towards the bottom for a subtle gradient feel.
        [$r2, $g2, $b2] = $this->hsvToRgb($hue, 0.65, 0.55);
        $bg2 = imagecolorallocate($img, $r2, $g2, $b2);

        imagefilledrectangle($img, 0, 0, $width, $height, $bg);

        // Diagonal accent band
        $accent = imagecolorallocatealpha($img, 255, 255, 255, 80);
        imagefilledpolygon($img, [0, $height, $width * 0.35, 0, 0, 0], 3, $accent);

        // Radial-ish highlight blob (approx with multiple ellipses)
        $highlight = imagecolorallocatealpha($img, 255, 255, 255, 30);
        imagefilledellipse($img, (int)($width * 0.78), (int)($height * 0.25), 320, 320, $highlight);

        // Text label, wrapped to the canvas width.
        $fontPath = $this->findFont();
        if ($fontPath !== null) {
            $fontSize = 44;
            $maxWidth = $width - 80;
            $wrapped = wordwrap($name, (int) floor($maxWidth / ($fontSize * 0.6)), "\n", true);
            $textColor = imagecolorallocate($img, 255, 255, 255);

            $bbox = imagettfbbox($fontSize, 0, $fontPath, $wrapped);
            $textWidth = abs($bbox[2] - $bbox[0]);
            $textHeight = abs($bbox[7] - $bbox[1]);
            $x = (int)(($width - $textWidth) / 2);
            $y = (int)(($height - $textHeight) / 2) - $bbox[7];

            imagettftext($img, $fontSize, 0, $x, $y, $textColor, $fontPath, $wrapped);
        }

        // Persist the webp
        $absolutePath = Storage::disk('public')->path($relativePath);
        imagewebp($img, $absolutePath, 85);
        imagedestroy($img);

        return $relativePath;
    }

    /**
     * Download a curated category image from the Pexels CDN and persist it as
     * webp. Returns true when the image was successfully written.
     */
    private function downloadRelevantImage(string $slug, string $relativePath): bool
    {
        $pexelsIds = [
            'electronics'           => '33039024',
            'tv_audio'              => '8089166',
            'home_appliances'       => '8583864',
            'men_s_fashion'         => '37252810',
            'women_s_fashion'       => '39068023',
            'kids_fashion'          => '14622835',
            'shoes_footwear'        => '1461048',
            'bags_luggage'          => '4974986',
            'watches_jewelry'       => '13646797',
            'beauty_personal_care'  => '7290627',
            'health_wellness'       => '13013778',
            'baby_maternity'        => '6849259',
            'toys_games'            => '8289844',
            'sports_fitness'        => '31759373',
            'automotive_motorcycle' => '28284823',
            'books_stationery'      => '5124880',
            'home_living'           => '37252552',
            'kitchen_dining'        => '5782042',
            'pet_supplies'          => '18764141',
            'tools_hardware'        => '175039',
            'garden_outdoor'        => '15258082',
            'office_business'       => '35242187',
            'travel_luggage'        => '3876040',
            'musical_instruments'   => '9717785',
        ];

        $id = $pexelsIds[$slug] ?? null;
        if ($id === null) {
            return false;
        }

        $url = 'https://images.pexels.com/photos/' . $id . '/pexels-photo-' . $id . '.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200';

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_USERAGENT      => 'CategorySeeder/1.0',
            CURLOPT_SSL_VERIFYPEER => false,
        ]);
        $raw  = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($code !== 200 || !is_string($raw) || $raw === '') {
            return false;
        }

        $img = @imagecreatefromstring($raw);
        if (!$img) {
            return false;
        }

        $width     = imagesx($img);
        $height    = imagesy($img);
        $newWidth  = 800;
        $newHeight = max(1, (int) round($height * ($newWidth / $width)));
        $scaled    = imagecreatetruecolor($newWidth, $newHeight);
        imagecopyresampled($scaled, $img, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

        imagewebp($scaled, Storage::disk('public')->path($relativePath), 85);
        imagedestroy($scaled);
        imagedestroy($img);

        return true;
    }

    /**
     * Locate a usable TrueType font for GD text rendering.
     */
    private function findFont(): ?string
    {
        $candidates = [
            'C:\Windows\Fonts\arialbd.ttf',
            'C:\Windows\Fonts\arial.ttf',
            'C:\Windows\Fonts\segoeui.ttf',
            '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
            '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
            '/usr/share/fonts/truetype/freefont/FreeSans.ttf',
        ];

        foreach ($candidates as $font) {
            if (is_file($font) && is_readable($font)) {
                return $font;
            }
        }

        return null;
    }

    /**
     * Convert HSV color space to RGB.
     *
     * @return array{0: int, 1: int, 2: int}
     */
    private function hsvToRgb(float $h, float $s, float $v): array
    {
        $h = fmod($h, 360) / 360.0;
        $i = (int) floor($h * 6);
        $f = $h * 6 - $i;
        $p = $v * (1 - $s);
        $q = $v * (1 - $f * $s);
        $t = $v * (1 - (1 - $f) * $s);

        return match ($i % 6) {
            0 => [(int)($v * 255), (int)($t * 255), (int)($p * 255)],
            1 => [(int)($q * 255), (int)($v * 255), (int)($p * 255)],
            2 => [(int)($p * 255), (int)($v * 255), (int)($t * 255)],
            3 => [(int)($p * 255), (int)($q * 255), (int)($v * 255)],
            4 => [(int)($t * 255), (int)($p * 255), (int)($v * 255)],
            5 => [(int)($v * 255), (int)($p * 255), (int)($q * 255)],
        };
    }
}