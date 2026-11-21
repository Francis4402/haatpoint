<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\File;

class ProductMediaController extends Controller
{
    /**
     * Proxy and cache supplier product images under the HaatPoint domain.
     * Prevents supplier URL exposure, protects branding, and leverages Cloudflare edge caching.
     */
    public function show(string $filename)
    {
        // Sanitize filename to prevent directory traversal
        $filename = basename($filename);
        if (empty($filename) || !preg_match('/^[a-zA-Z0-9_\-\.]+$/', $filename)) {
            return response()->file(public_path('placeholder.jpg'));
        }

        $localDir = storage_path('app/public/product-cache');
        if (!File::exists($localDir)) {
            File::makeDirectory($localDir, 0755, true);
        }

        $localPath = $localDir . DIRECTORY_SEPARATOR . $filename;

        // 1. If already cached locally, serve immediately
        if (File::exists($localPath)) {
            return response()->file($localPath, [
                'Content-Type' => $this->getMimeType($filename),
                'Cache-Control' => 'public, max-age=31536000, immutable',
            ]);
        }

        // 2. Fetch from supplier silently
        $supplierBase = 'https://shopbasebd.com/public/uploads/shop/products/';
        $supplierUrl = $supplierBase . $filename;

        try {
            $res = Http::timeout(6)
                ->withHeaders(['User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'])
                ->get($supplierUrl);

            if ($res->successful()) {
                File::put($localPath, $res->body());

                return response($res->body(), 200, [
                    'Content-Type' => $this->getMimeType($filename),
                    'Cache-Control' => 'public, max-age=31536000, immutable',
                ]);
            }

            // Fallback: If _L_ failed, try _S_ (thumbnail) or .jpg
            if (str_contains($filename, '_L_')) {
                $altFilename = preg_replace('/_L_(\d+)\.(jpeg|jpg)$/i', '_S_$1.jpg', $filename);
                $resAlt = Http::timeout(5)->get($supplierBase . $altFilename);
                if ($resAlt->successful()) {
                    File::put($localPath, $resAlt->body());
                    return response($resAlt->body(), 200, [
                        'Content-Type' => $this->getMimeType($filename),
                        'Cache-Control' => 'public, max-age=31536000, immutable',
                    ]);
                }
            }
        } catch (\Exception $e) {
            // Log if needed, then fallback
        }

        // 3. Fallback placeholder
        $placeholder = public_path('placeholder.jpg');
        if (File::exists($placeholder)) {
            return response()->file($placeholder);
        }

        return response('', 404);
    }

    private function getMimeType(string $filename): string
    {
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        return match ($ext) {
            'png' => 'image/png',
            'webp' => 'image/webp',
            'gif' => 'image/gif',
            'svg' => 'image/svg+xml',
            default => 'image/jpeg',
        };
    }
}
