Feature: Reading blog articles

  Scenario: As a visitor I can list all articles ordered from newest to oldest
    Given I use seed data
    When I send a "GET" request to "/api/v1/articles"
    Then the response status should be 200
    And the response list should have 3 items
    And the response list item at index 0 should have property "id" equal to "5e1f0a2b-0003-4000-8000-000000000003"
    And the response list item at index 1 should have property "id" equal to "5e1f0a2b-0002-4000-8000-000000000002"
    And the response list item at index 2 should have property "id" equal to "5e1f0a2b-0001-4000-8000-000000000001"

  Scenario: As a visitor I get a deterministic order when two articles have the exact same publication date
    Given two articles exist with the exact same publication date
    When I send a "GET" request to "/api/v1/articles"
    Then the response status should be 200
    And the response list should have 2 items
    And the response list item at index 0 should have property "id" equal to "5e1f0a2b-0001-4000-8000-000000000001"
    And the response list item at index 1 should have property "id" equal to "5e1f0a2b-0002-4000-8000-000000000002"

  Scenario: As a visitor I get an empty list when no articles exist
    Given there are no articles in the database
    When I send a "GET" request to "/api/v1/articles"
    Then the response status should be 200
    And the response body should contain:
      """
      []
      """

  Scenario: As a visitor I can read a single existing article by its ID
    Given I use seed data
    When I send a "GET" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000001"
    Then the response status should be 200
    And the response body should contain:
      """
      {
        "id": "5e1f0a2b-0001-4000-8000-000000000001",
        "title": "Getting Started with NestJS and Prisma 7",
        "content": "In this article, we explore how to structure a modern NestJS back-end application using CQRS and Prisma 7 with PostgreSQL.",
        "publishedAt": "2026-08-01T10:00:00.000Z"
      }
      """

  Scenario: As a visitor I receive 404 when requesting an article ID that does not exist
    Given I use seed data
    When I send a "GET" request to "/api/v1/articles/5e1f0a2b-9999-4000-8000-000000000099"
    Then the response status should be 404
    And the response body should have the property "message"

  Scenario: As a visitor I receive 400 when requesting an invalid article ID format
    When I send a "GET" request to "/api/v1/articles/not-a-valid-uuid"
    Then the response status should be 400
    And the response body should have the property "message"
