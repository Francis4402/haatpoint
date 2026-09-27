<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Password shared by every seeded account.
     */
    public const PASSWORD = 'password';

    /**
     * Super admin / admin / deliverymen / customers.
     *
     * Idempotent: keyed on the unique e-mail column.
     */
    public function run(): void
    {
        $password = Hash::make(self::PASSWORD);
        $now = now();

        // ---- Platform staff -------------------------------------------------
        $admins = [
            [
                'name' => 'Francis Haatpoint',
                'email' => 'superadmin@haatpoint.test',
                'role' => 'superadmin',
                'images' => null,
            ],
            [
                'name' => 'Nusrat Jahan',
                'email' => 'admin@haatpoint.test',
                'role' => 'admin',
                'images' => null,
            ],
        ];

        foreach ($admins as $admin) {
            Admin::updateOrCreate(
                ['email' => $admin['email']],
                [
                    'name' => $admin['name'],
                    'role' => $admin['role'],
                    'images' => $admin['images'],
                    'email_verified_at' => $now,
                    'password' => $password,
                    'blocked' => false,
                ]
            );
        }

        // ---- Deliverymen ----------------------------------------------------
        $deliverymen = [
            ['name' => 'Rakib Hasan', 'email' => 'rakib@haatpoint.test'],
            ['name' => 'Shahin Alam', 'email' => 'shahin@haatpoint.test'],
            ['name' => 'Javed Iqbal', 'email' => 'javed@haatpoint.test'],
        ];

        foreach ($deliverymen as $deliveryman) {
            User::updateOrCreate(
                ['email' => $deliveryman['email']],
                [
                    'name' => $deliveryman['name'],
                    'role' => 'deliveryman',
                    'images' => null,
                    'email_verified_at' => $now,
                    'password' => $password,
                    'blocked' => false,
                ]
            );
        }

        // ---- Customers ------------------------------------------------------
        $customers = [
            ['name' => 'Test User', 'email' => 'test@example.com'],
            ['name' => 'Ayesha Siddiqua', 'email' => 'ayesha@example.com'],
            ['name' => 'Tanvir Rahman', 'email' => 'tanvir@example.com'],
            ['name' => 'Nusrat Jahan Mim', 'email' => 'mim@example.com'],
            ['name' => 'Sabbir Ahmed', 'email' => 'sabbir@example.com'],
            ['name' => 'Farhana Akter', 'email' => 'farhana@example.com'],
            ['name' => 'Imran Chowdhury', 'email' => 'imran@example.com'],
            ['name' => 'Mehedi Hasan', 'email' => 'mehedi@example.com'],
            ['name' => 'Sumaiya Akter', 'email' => 'sumaiya@example.com'],
            ['name' => 'Rifat Hossain', 'email' => 'rifat@example.com'],
            ['name' => 'Tania Sultana', 'email' => 'tania@example.com'],
            ['name' => 'Arif Chowdhury', 'email' => 'arif@example.com'],
            ['name' => 'Shamima Khatun', 'email' => 'shamima@example.com'],
            ['name' => 'Nayeem Uddin', 'email' => 'nayeem@example.com'],
            ['name' => 'Roksana Begum', 'email' => 'roksana@example.com'],
            ['name' => 'Sohel Rana', 'email' => 'sohel@example.com'],
            ['name' => 'Mithila Rahman', 'email' => 'mithila@example.com'],
            ['name' => 'Kamal Uddin', 'email' => 'kamal@example.com'],
            ['name' => 'Jannatul Ferdous', 'email' => 'jannatul@example.com'],
            ['name' => 'Raihan Kabir', 'email' => 'raihan@example.com'],
        ];

        foreach ($customers as $customer) {
            User::updateOrCreate(
                ['email' => $customer['email']],
                [
                    'name' => $customer['name'],
                    'role' => 'user',
                    'images' => null,
                    'email_verified_at' => $now,
                    'password' => $password,
                    'blocked' => false,
                ]
            );
        }

        $this->command?->info(sprintf(
            'Users: %d admins, %d deliverymen, %d customers.',
            count($admins),
            count($deliverymen),
            count($customers)
        ));
    }
}
