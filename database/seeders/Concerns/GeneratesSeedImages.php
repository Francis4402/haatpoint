<?php

namespace Database\Seeders\Concerns;

use Illuminate\Support\Facades\Storage;

/**
 * Small GD based image factory used by the seeders so a freshly seeded
 * database has real, viewable images instead of broken <img> tags.
 *
 * Everything it produces is deterministic: the same label always renders the
 * same picture, which keeps the seeders idempotent.
 */
trait GeneratesSeedImages
{
    /**
     * @return array{0: int, 1: int, 2: int}
     */
    protected function hsvToRgb(float $h, float $s, float $v): array
    {
        $h = fmod($h, 360) / 360.0;
        $i = (int) floor($h * 6);
        $f = $h * 6 - $i;
        $p = $v * (1 - $s);
        $q = $v * (1 - $f * $s);
        $t = $v * (1 - (1 - $f) * $s);

        return match ($i % 6) {
            0 => [(int) ($v * 255), (int) ($t * 255), (int) ($p * 255)],
            1 => [(int) ($q * 255), (int) ($v * 255), (int) ($p * 255)],
            2 => [(int) ($p * 255), (int) ($v * 255), (int) ($t * 255)],
            3 => [(int) ($p * 255), (int) ($q * 255), (int) ($v * 255)],
            4 => [(int) ($t * 255), (int) ($p * 255), (int) ($v * 255)],
            default => [(int) ($v * 255), (int) ($p * 255), (int) ($t * 255)],
        };
    }

    /**
     * Locate a usable TrueType font for GD text rendering.
     */
    protected function findFont(): ?string
    {
        $candidates = [
            'C:\Windows\Fonts\arialbd.ttf',
            'C:\Windows\Fonts\arial.ttf',
            'C:\Windows\Fonts\segoeuib.ttf',
            'C:\Windows\Fonts\segoeui.ttf',
            '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
            '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
            '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
            '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
            '/System/Library/Fonts/Helvetica.ttc',
        ];

        foreach ($candidates as $font) {
            if (is_file($font) && is_readable($font)) {
                return $font;
            }
        }

        return null;
    }

    /**
     * Stable hue for a label so each generated image gets its own colour.
     */
    protected function labelHue(string $label, int $offset = 0): float
    {
        return (float) (crc32($label . '|' . $offset) % 360);
    }

    /**
     * Render a square label image (brand monogram style) and return the path
     * relative to the public disk, or null when GD is unavailable.
     */
    protected function renderLabelImage(string $directory, string $filename, string $label, int $size = 600, string $format = 'jpg'): ?string
    {
        if (! function_exists('imagecreatetruecolor')) {
            return null;
        }

        $relativePath = $directory . '/' . $filename . '.' . $format;

        if (Storage::disk('public')->exists($relativePath)) {
            return $relativePath;
        }

        $hue = $this->labelHue($label);
        [$r1, $g1, $b1] = $this->hsvToRgb($hue, 0.42, 0.86);
        [$r2, $g2, $b2] = $this->hsvToRgb($hue, 0.55, 0.62);

        $img = imagecreatetruecolor($size, $size);

        // Vertical gradient background.
        for ($y = 0; $y < $size; $y++) {
            $ratio = $y / max(1, $size - 1);
            $color = imagecolorallocate(
                $img,
                (int) ($r1 + ($r2 - $r1) * $ratio),
                (int) ($g1 + ($g2 - $g1) * $ratio),
                (int) ($b1 + ($b2 - $b1) * $ratio)
            );
            imageline($img, 0, $y, $size, $y, $color);
        }

        // Soft highlight and diagonal band.
        imagefilledellipse(
            $img,
            (int) ($size * 0.78),
            (int) ($size * 0.22),
            (int) ($size * 0.55),
            (int) ($size * 0.55),
            imagecolorallocatealpha($img, 255, 255, 255, 96)
        );
        imagefilledpolygon(
            $img,
            [0, $size, (int) ($size * 0.45), 0, 0, 0],
            3,
            imagecolorallocatealpha($img, 255, 255, 255, 110)
        );

        // Monogram = first letters of up to two words.
        $words = preg_split('/\s+/', trim($label)) ?: [];
        $initials = mb_strtoupper(mb_substr($words[0] ?? 'H', 0, 1));
        if (count($words) > 1) {
            $initials .= mb_strtoupper(mb_substr($words[1], 0, 1));
        }

        $font = $this->findFont();
        $white = imagecolorallocate($img, 255, 255, 255);

        if ($font !== null) {
            $fontSize = (int) ($size * 0.42);
            $bbox = imagettfbbox($fontSize, 0, $font, $initials);
            $textWidth = abs($bbox[2] - $bbox[0]);
            $textHeight = abs($bbox[7] - $bbox[1]);
            $x = (int) (($size - $textWidth) / 2);
            $y = (int) (($size + $textHeight) / 2 - $bbox[7]);
            imagettftext($img, $fontSize, 0, $x, $y, $white, $font, $initials);
        } else {
            // No TTF font available: fall back to the tiny built-in bitmap font.
            imagestring($img, 5, (int) ($size / 2 - 12), (int) ($size / 2), $initials, $white);
        }

        // Thin inner border for a card-like framing.
        imagerectangle($img, 12, 12, $size - 13, $size - 13, imagecolorallocatealpha($img, 255, 255, 255, 70));

        $absolute = Storage::disk('public')->path($relativePath);

        if ($format === 'webp') {
            imagewebp($img, $absolute, 85);
        } else {
            imagejpeg($img, $absolute, 85);
        }

        imagedestroy($img);

        return $relativePath;
    }
}
