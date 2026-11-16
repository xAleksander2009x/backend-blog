Feature: Manage blog articles (Admin Write API)

  Scenario: Admin can create a new article with valid data
    Given I use seed data
    And I use admin token
    When I send a "POST" request to "/api/v1/articles" with body:
      """
      {
        "title": "New Architecture Guide",
        "content": "This is a valid article content with more than ten characters."
      }
      """
    Then the response status should be 201
    And the response body should have the property "id"
    And the response body should have the property "publishedAt"
    And the response body should have property "title" equal to "New Architecture Guide"
    And the response body should have property "content" equal to "This is a valid article content with more than ten characters."
    Given I use no token
    When I send a "GET" request to "/api/v1/articles"
    Then the response status should be 200
    And the response list should have 4 items
    And the response list item at index 0 should have property "title" equal to "New Architecture Guide"

  Scenario: Creating or editing an article with invalid data returns 400 with violations
    Given I use seed data
    And I use admin token
    When I send a "POST" request to "/api/v1/articles" with body:
      """
      {
        "title": "Hi",
        "content": "Short"
      }
      """
    Then the response status should be 400
    And the response body should have the property "violations"
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000001" with body:
      """
      {
        "title": "No",
        "content": "Tiny"
      }
      """
    Then the response status should be 400
    And the response body should have the property "violations"

  Scenario: Creating or editing with server-owned or unknown fields returns 400
    Given I use seed data
    And I use admin token
    When I send a "POST" request to "/api/v1/articles" with body:
      """
      {
        "id": "5e1f0a2b-9999-4000-8000-000000000099",
        "title": "Valid Title Here",
        "content": "Valid article content with enough characters."
      }
      """
    Then the response status should be 400
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000001" with body:
      """
      {
        "publishedAt": "2026-01-01T00:00:00.000Z"
      }
      """
    Then the response status should be 400
    When I send a "POST" request to "/api/v1/articles" with body:
      """
      {
        "title": "Valid Title Here",
        "content": "Valid article content with enough characters.",
        "unknownField": "forbidden"
      }
      """
    Then the response status should be 400

  Scenario: Admin can edit an existing article without changing its publication date
    Given I use seed data
    And I use admin token
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000001" with body:
      """
      {
        "title": "Updated Getting Started Title"
      }
      """
    Then the response status should be 200
    And the response body should have property "id" equal to "5e1f0a2b-0001-4000-8000-000000000001"
    And the response body should have property "title" equal to "Updated Getting Started Title"
    And the response body should have property "publishedAt" equal to "2026-08-01T10:00:00.000Z"

  Scenario: Editing or deleting a non-existent article returns 404
    Given I use seed data
    And I use admin token
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-9999-4000-8000-000000000099" with body:
      """
      {
        "title": "Valid Title"
      }
      """
    Then the response status should be 404
    When I send a "DELETE" request to "/api/v1/articles/5e1f0a2b-9999-4000-8000-000000000099"
    Then the response status should be 404

  Scenario: Editing or deleting with an invalid UUID returns 400
    Given I use admin token
    When I send a "PATCH" request to "/api/v1/articles/not-a-valid-uuid" with body:
      """
      {
        "title": "Valid Title"
      }
      """
    Then the response status should be 400
    When I send a "DELETE" request to "/api/v1/articles/not-a-valid-uuid"
    Then the response status should be 400

  Scenario: Admin can delete an existing article and reading it afterwards gives 404
    Given I use seed data
    And I use admin token
    When I send a "DELETE" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000001"
    Then the response status should be 204
    Given I use no token
    When I send a "GET" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000001"
    Then the response status should be 404

  Scenario: Write requests without a token return 401 even with invalid data
    Given I use no token
    When I send a "POST" request to "/api/v1/articles" with body:
      """
      {
        "title": "x",
        "content": "y"
      }
      """
    Then the response status should be 401
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000001" with body:
      """
      {
        "title": "Valid Title"
      }
      """
    Then the response status should be 401
    When I send a "DELETE" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000001"
    Then the response status should be 401

  Scenario: Write requests with a wrong token return 403
    Given I use wrong token
    When I send a "POST" request to "/api/v1/articles" with body:
      """
      {
        "title": "Valid Title",
        "content": "Valid article content with enough characters."
      }
      """
    Then the response status should be 403
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000001" with body:
      """
      {
        "title": "Valid Title"
      }
      """
    Then the response status should be 403
    When I send a "DELETE" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000001"
    Then the response status should be 403
