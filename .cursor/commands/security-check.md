# Security check
Check the current changes for security issues and report with file, line and fix:
- Hard-coded secrets, tokens, keys, URLs with credentials; secrets in logs
- Missing authentication or authorisation checks on endpoints
- Missing input validation; injection risks (SQL, NoSQL, command, path traversal)
- Unsafe file uploads, open redirects, CORS set to "*"
- Personal data logged or exposed in responses
- New dependencies: name them so I can check they are real and maintained
- Infra code: public resources, open security groups, missing encryption, wide IAM policies
Do not edit files. If nothing is found, say so clearly.


