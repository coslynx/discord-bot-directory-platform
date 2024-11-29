#!/bin/bash

# Run frontend tests
cd frontend
npm run test

# Run backend tests (assuming you have backend tests set up)
cd ../backend
npm run test

# Check for errors
if [ $? -ne 0 ]; then
  echo "Tests failed!"
  exit 1
fi

echo "Tests passed!"
exit 0
```