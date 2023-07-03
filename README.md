# Kanban task management web app

![Design preview for the Kanban task management web app coding challenge](https://tinypic.host/images/2023/07/02/preview.jpeg)

## The challenge

Your challenge is to build out this task management app and get it looking as close to the design as possible.

Find the Design [here](https://www.figma.com/file/DrUaiIClCzsKWc4uwUrlAL/kanban-task-management-web-app?type=design&mode=design&t=VaU0Edb8BUFf1fO9-1)

You can use any tools you like to help you complete the challenge. So if you've got something you'd like to practice, feel free to give it a go.

Provide the data using Trello API , check below links API guide:

- http://www.trello.org/help.html
- https://developer.atlassian.com/cloud/trello/rest/
- https://trello.com/app-key

Your users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Create, read, update, and delete boards and tasks
- Receive form validations when trying to create/edit boards and tasks
- Mark subtasks as complete and move tasks between columns
- Hide/show the board sidebar
- Toggle the theme between light/dark modes
- Keep track of any changes, even after refreshing the browser (changes presisted at Trello API )
- **Bonus**: Allow users to drag and drop tasks to change their status and re-order them in a column

### Expected Behaviour

- Boards
  - Clicking different boards in the sidebar will change to the selected board.
  - Clicking "Create New Board" in the sidebar opens the "Add New Board" modal.
  - Clicking in the dropdown menu "Edit Board" opens up the "Edit Board" modal where details can be changed.
  - Columns are added and removed for the Add/Edit Board modals.
  - Deleting a board deletes all columns and tasks and requires confirmation.
- Columns
  - A board needs at least one column before tasks can be added. If no columns exist, the "Add New Task" button in the header is disabled.
  - Clicking "Add New Column" opens the "Edit Board" modal where columns are added.
- Tasks
  - Adding a new task adds it to the bottom of the relevant column.
  - Updating a task's status will move the task to the relevant column. If you're taking on the drag and drop bonus, dragging a task to a different column will also update the status.

### Make Sure of the following

- Pages are Error Free
- Comments effectively explain longer code procedures.
- Files are organized with a directory structure that separates files based on functionality.
- Using Redux as state managment tool
- Using Typescript
- Perform unit testing, run a test that passes when all lists in a board are loaded and displayed to the user using (jest / react testing library)

## Submitting your solution

> Bundle your project folder into a git repo with name ft-kanban-app

> Deadline to recieve the submissions : Sunday 09.07.2023 @ 09:00pm

> Send a link to your submission to : [instructors@renolab.net](mailto:instructors@renolab.net)
