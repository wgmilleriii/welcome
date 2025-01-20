<?php

class TodoGptProcessor {
    private $api_key;
    private $todo_dir;
    private $gpt_endpoint = 'https://api.openai.com/v1/chat/completions';

    public function __construct($api_key, $todo_dir = '../TODO/') {
        $this->api_key = $api_key;
        $this->todo_dir = $todo_dir;
    }

    public function processAllTodos() {
        $results = [];
        $directories = glob($this->todo_dir . '*', GLOB_ONLYDIR);
        
        foreach ($directories as $dir) {
            $overview_file = $dir . '/overview.md';
            if (file_exists($overview_file)) {
                $org_name = basename($dir);
                $results[$org_name] = $this->processSingleTodo($overview_file);
            }
        }
        
        return $results;
    }

    private function processSingleTodo($overview_file) {
        // Read the overview content
        $content = file_get_contents($overview_file);
        if (!$content) {
            return ['error' => 'Could not read overview file'];
        }

        // Process with GPT
        $response = $this->queryGPT($content);
        
        // Save the response
        $response_file = dirname($overview_file) . '/gpt_analysis.md';
        file_put_contents($response_file, $response);
        
        return [
            'overview' => $content,
            'gpt_response' => $response
        ];
    }

    private function queryGPT($content) {
        $data = [
            'model' => 'gpt-4',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'You are an AI assistant analyzing TODO lists and project overviews. Provide insights, suggestions for improvement, and potential timeline estimates.'
                ],
                [
                    'role' => 'user',
                    'content' => "Please analyze this project overview and TODO list:\n\n$content"
                ]
            ],
            'temperature' => 0.7,
            'max_tokens' => 1000
        ];

        $ch = curl_init($this->gpt_endpoint);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $this->api_key
        ]);

        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($http_code !== 200) {
            return "Error: HTTP $http_code\n$response";
        }

        $response_data = json_decode($response, true);
        return $response_data['choices'][0]['message']['content'] ?? 'No response content';
    }
}

// Example usage:
if (php_sapi_name() === 'cli') {
    $api_key = getenv('OPENAI_API_KEY');
    if (!$api_key) {
        die("Please set OPENAI_API_KEY environment variable\n");
    }

    $processor = new TodoGptProcessor($api_key);
    $results = $processor->processAllTodos();
    
    foreach ($results as $org => $result) {
        echo "\nProcessed $org:\n";
        echo "GPT Analysis saved to: {$org}/gpt_analysis.md\n";
        if (isset($result['error'])) {
            echo "Error: {$result['error']}\n";
        }
    }
} 