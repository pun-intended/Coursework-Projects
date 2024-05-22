# **Lending Library**
- - -
[Link - Hosted on Render](#https://lending-library-xjrg.onrender.com/)
|Login Details| |
|-----|-----|
|id | 10001|
|password | password|


### **Description**
---
This is a capstone project to showcase the knowledge gained through the bootcamp course I was enrolled in.  The aim was to build an app that could streamline the lending library system used by the school I am currently working in.  The aim was to replace need for slips of paper to track who borrowed a book when, show at a glance which students still have a book, find who has a given book, and generally speed up the process of checking-in  and -out books. Using this someone can quickly and easily assign a book to a student in 3 clicks, or check in a book in 2.  Tracking of the condition of books at the time of checkin can provide the school with the number of books in poor condition at a glance.

### **Current Features**
---
- **All Books** 
  - Show all the books for the to the class
- **Students** 
  - show all students and whether or not they have a book
- **Check-in** 
  - Return a book in the system, and update the condition of the book
- **Check-out** 
  - mark a book as borrowed in the system
- **Reflect changes** 
  - Adjust the information presented on the site to reflect changes in who has a book, and which books are available

### **Tech used**
---
- **Backend**
  - express
  - psql

- **Frontend**
  - React

### **Flow**
---
- Users in this description refers to teachers using the application.
- Users will login, navigate to either the 'Students' or 'Books' page
- '*Students*' page - Users can click the icon next to a students name to bring up a window allowing them to check in an outstanding book, or check out a book to that student.
- 'Check-in' - Users can check in a book, marking it as returned and returning it to the pool of books that are available to be borrowed.  Choosing a date in the drop down box will assign that value to the "returned date" for the record. The user can also specify if the book is in 'poor', 'good', or 'great' condition.
- 'Check-out' - Users can choose a book from the options shown.  The list is made of books that are both available, and not yet borrowed by the student.
- 'Books' - Shows all books in the library with the option to check in or check out teach book, depending on its current availability. 
- 'Check in' - mirrors the window found on the students page
- 'Check-out' - Allows user to select a student from a dropdown list of students.  These students are those that have not yet read the book, and don't currently have a book (school rules limit one book per student)

### **Future Features**
---
- **Classes**
  - Filter students by the class they are in
- **Stages** 
  - Show books appropriate for the reading level of the students
- **Schools** 
  - Filter students by the 
- **Admin** 
  - Admin status that will allow for changes to students, classes books and schools

