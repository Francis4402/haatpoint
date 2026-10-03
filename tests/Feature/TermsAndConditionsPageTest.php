<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Pins the terms and conditions route that the checkout agreement links to.
 *
 * The checkout checkbox linked to a hardcoded "/terms", which was never routed
 * -- the real path is /terms-and-conditions. Nothing caught it because no test
 * covered the page and the browser only fails once a customer is mid-checkout.
 * The link now goes through route('terms.and.conditions'), so this test failing
 * on a rename is the signal that the checkout link needs updating too.
 */
class TermsAndConditionsPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_terms_page_is_publicly_reachable(): void
    {
        $this->get(route('terms.and.conditions'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('termscondition/index'));
    }

    public function test_the_terms_path_is_the_one_the_checkout_links_to(): void
    {
        // Guards against the path drifting away from what the checkout assumes.
        // route() returns an absolute URL, so compare the path only.
        $this->assertSame(
            '/terms-and-conditions',
            parse_url(route('terms.and.conditions'), PHP_URL_PATH)
        );
    }
}