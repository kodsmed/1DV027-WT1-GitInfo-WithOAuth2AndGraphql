# Assignment WT1 - OAuth + Consuming REST and GraphQL APIs

In modern web applications, the ability to delegate access between systems is crucial. One widely used standard for access delegation is OAuth (Open Authorization). Although the OAuth flow may appear complex at first glance, it is important to understand the roles and communication of the different stakeholders (client/consumer/service provider) involved.

## The assignment

Your task is to develop a three-legged OAuth2 access delegation system for a server-side rendered web application (the consumer) and GitLab (the service provider). The system should enable users to log in to the consumer application using their gitlab.lnu.se account (#10) and access the following information from GitLab: basic profile information (#11), the 101 most recent GitLab activities (#12), and information about groups, projects and the latest commit.

In particular, the system should allow users to view details about the first three projects in each of their first five groups, including information about the latest commit, provided that they have access to those groups (#13).

Note that you must not use any external packages or modules that have built-in OAuth support (#2).

If you're aiming for a higher grade, it's important you choose a design and structure for your code that makes it easier to develop, test, and maintain over time. (#14)

## Requirements

Please review [all requirements of the application](../../issues/) including (#1, #2, #3, #4, #5, #6, #7, #8, #9, #10, #11, #12, #13, and #14). Pay special attention to the labels indicating if a requirement is required or optional.

As you implement tasks and add functionality, it is important to create and close issues accordingly.

## Issues

* 1 As a developer, I want the code to be clear and well-structured.
* 2 As a developer, I want to reuse code. Npm packages and I validate them.
* 3 As a developer, I want to manage dependencies and organize scripts I use often. Package.json, Manifest etc.
* 4 The source code in all projects must be documented according to the best practices of the programming language used including line comments. All classes, methods and functions except anonymous functions must be documented. Code hard to understand is documented with line comments.
* 5 As a developer, I want the source code to follow a coding standard. The code should be es-linted and follow the standard of the programming language used.
* 6 As a student, I want it to be possible for the examiner to follow the creation of the application. Commits.
* 7 As an end-user, I want to access the service over the internet. Https must be enforced. The service must be resilient and restart if it crashes. The service must be operational in a "production" environment, ie, no dev packages.
* 8 As a developer and end-user, I want the keys and tokens to be handled correctly.
* 9 As a student, I want the examiner to be able to read a complete Assignment Report, provided with correct links. Fill in the Assignment Report. The link to my application is clearly visible.
* 10 As an end user, I want to be able to login to the application using my gitlab.lnu.se-account.
* 11 As an end user, I want to be able to see my profile information on the start page. Name, Username, User ID, Email, Avatar, last activity date and time.
* 12 As an end user, I want to be able to see my 101 latest activities.
* 13 As an end user, I want to be able to list at most three groups, and at most, five projects, including subgroups, of a specific group, along with the date and author of the most recent commit for each project.

* 14 As a developer, I want to organize the code, making it easier to develop, test and maintain. OPTIONAL.

## Assignment Report

The front end is a very minimum. I would very much liked to have a more polished front end, with for example loading indicators. But I have focused on the backend since that is the main focus of the assignment.

