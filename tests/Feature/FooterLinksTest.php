<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class FooterLinksTest extends TestCase
{
    private function footerSource(): string
    {
        return file_get_contents(resource_path('js/Pages/Components/Footer.tsx'));
    }

    public function test_every_footer_link_resolves_to_a_registered_route(): void
    {
        // The footer used to hard-code URIs and, for four entries, '#' with no
        // destination at all. A renamed route then 404s silently, because
        // nothing ever resolves the name against the router.
        $source = $this->footerSource();

        preg_match_all("/route\\('([^']+)'/", $source, $matches);

        $this->assertNotEmpty($matches[1], 'The footer should build its links with route().');

        foreach (array_unique($matches[1]) as $name) {
            $this->assertTrue(
                Route::has($name),
                "The footer links to route '{$name}', which is not registered."
            );
        }
    }

    public function test_the_footer_has_no_placeholder_links(): void
    {
        // Featured / Daily discover / Returns all have real destinations now.
        // Payout schedule was dropped instead, because no such page exists.
        $source = $this->footerSource();

        $this->assertStringNotContainsString("href: '#'", $source);
        $this->assertStringNotContainsString('href: "#"', $source);
        $this->assertStringNotContainsString('Payout schedule', $source);
        $this->assertStringNotContainsString('TODO: no route', $source);
    }
}
