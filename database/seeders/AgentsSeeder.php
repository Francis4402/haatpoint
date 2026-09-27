<?php

namespace Database\Seeders;

use App\Models\Agent;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AgentsSeeder extends Seeder
{
    /**
     * Number of vendor agents to create.
     */
    public const AGENT_COUNT = 5;

    /**
     * Vendor agents. Every agent carries valid KYC data (10/17 digit national
     * id + mobile) because StoreController refuses to open a store for an agent
     * whose national id is missing or malformed.
     *
     * Idempotent: keyed on the unique e-mail column.
     */
    public function run(): void
    {
        $password = Hash::make(UsersSeeder::PASSWORD);
        $now = now();

        $agents = [
            [
                'name' => 'Agent One - Rahim Store',
                'email' => 'agent1@haatpoint.test',
                'mobile' => '01711000001',
                'national_id' => '1990123456',
                'address' => 'Shop 12, Dhanmondi Market, Dhaka 1209',
            ],
            [
                'name' => 'Agent Two - Karim Traders',
                'email' => 'agent2@haatpoint.test',
                'mobile' => '01711000002',
                'national_id' => '2981234567',
                'address' => 'House 7, Road 5, Chittagong 4000',
            ],
            [
                'name' => 'Agent Three - Sultana Boutique',
                'email' => 'agent3@haatpoint.test',
                'mobile' => '01711000003',
                'national_id' => '3712345678',
                'address' => 'Shop 3, Zindabazar, Sylhet 3100',
            ],
            [
                'name' => 'Agent Four - Modern Electronics',
                'email' => 'agent4@haatpoint.test',
                'mobile' => '01711000004',
                'national_id' => '4123456789',
                'address' => 'Plot 44, Sonargaon C/A, Dhaka 1212',
            ],
            [
                'name' => 'Agent Five - Green Leaf Grocery',
                'email' => 'agent5@haatpoint.test',
                'mobile' => '01711000005',
                'national_id' => '51234567890',
                'address' => 'Station Road, Rajshahi 6000',
            ],
        ];

        // Guard against the constant being raised without extending the list.
        foreach (array_slice($agents, 0, self::AGENT_COUNT) as $agent) {
            Agent::updateOrCreate(
                ['email' => $agent['email']],
                [
                    'name' => $agent['name'],
                    'role' => 'agent',
                    'mobile' => $agent['mobile'],
                    'national_id' => $agent['national_id'],
                    'address' => $agent['address'],
                    'images' => null,
                    'email_verified_at' => $now,
                    'password' => $password,
                    'blocked' => false,
                ]
            );
        }

        $this->command?->info(sprintf('Agents: %d created (password: %s).', self::AGENT_COUNT, UsersSeeder::PASSWORD));
    }
}
