#!/bin/bash

# Check if OPENAI_API_KEY is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "Error: OPENAI_API_KEY environment variable is not set"
    echo "Please set it with: export OPENAI_API_KEY='your-api-key'"
    exit 1
fi

# Run the PHP script
php todo_gpt_processor.php

# Check if the script ran successfully
if [ $? -eq 0 ]; then
    echo "Successfully processed all TODO overviews"
else
    echo "Error processing TODO overviews"
    exit 1
fi 