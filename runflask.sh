#!/bin/bash

# Parse command line arguments
while [[ $# -gt 0 ]]
do
    key=$1
    
    case $key in 
        --debug)
            export FLASK_DEBUG=1
            shift
            ;;
        *)
            echo "Unknown argument '$key'"
            exit 1
            ;;
    esac
done

# Run the flask app
export FLASK_APP=PhasmophobiaAssistant.py
python3 -m flask run
