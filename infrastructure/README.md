# Infrastructure

This directory will contain reviewed NorthStar infrastructure definitions and operational documentation.

Infrastructure is managed through Terraform and GitHub Actions using Workload Identity Federation. Do not store secret values, long-lived service-account keys, Terraform state or production credentials in this repository.

Production IAM, KMS, networking, destructive migration and deployment-permission changes require independent qualified review under the Git workflow policy.
