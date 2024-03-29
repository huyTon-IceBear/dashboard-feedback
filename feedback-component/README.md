# SnapFlow Feedback Component

The `feedback-component` folder within this repository is dedicated to the development of the SnapFlow Feedback feature. This component enhances user interaction by providing a streamlined feedback submission process with additional multimedia context. The folder includes two main modules:

## 1. Feedback Component Code

In the `feedback` folder inside `feedback-component`, you'll find the code for SnapFlow Feedback. This component is made up of specific parts, each with its own job.

### Feedback Component Parts

#### 1.1 ElementHighlighter and ElementSelector

These parts, namely `ElementHighlighter` and `ElementSelector`, make feedback easier. Inspired by Chrome's "select an element to inspect," they let users choose elements visually. When you hover over a component, a special highlighter draws a blue rectangle around it. It's easy to use and even captures the whole page for detailed feedback.

#### 1.2 FeedbackButton

Think of `FeedbackButton` as the core component—it brings everything together in SnapFlow Feedback. It's the main button users click to start and manage the feedback process.

#### 1.3 ScreenRecord

`ScreenRecord` is in charge of screen recordings. It's built from scratch without relying on other tools. Using the MediaRecorder from MDN, it ensures reliable recordings. When users click the record button, a popup asks them to choose the screen to record. This works consistently across different browsers.

#### 1.4 Step Folder

Inside the `step` folder, you'll find three files:

- `ChooseItemStep`: Lets users pick the item they want to give feedback on.
- `FeedbackStep`: Handles the actual feedback input from users.
- `ProvideDetailStep`: Helps users add extra details or context to their feedback.

To start working with SnapFlow Feedback, go to the [feedback](./feedback-component/feedback) folder.


## 2. Feedback API

The `api/feedback` folder within `feedback-component` houses the API module responsible for handling file uploads to Amazon S3. This API is an essential part of the SnapFlow Feedback component, enabling the storage of multimedia files associated with user feedback.

### Key Functions:

- **File Upload to S3**: The API handles file uploads to Amazon S3, allowing users to attach multimedia content to their feedback submissions.
- **Secure Authentication**: Utilizes authentication mechanisms to ensure secure and authorized file uploads.

To understand and contribute to the development of the Feedback API, navigate to the [api/feedback](./feedback-component/api/feedback) folder.

## Configuration

Make sure to set up your environment variables by copying the provided `.env.example` 

## Getting Started

To integrate the SnapFlow Feedback component into your Next.js, React, TypeScript project, follow these steps:

1. Add the `feedback-component` component to your project.

2. Install all needed dependencies and add all needed keys for environment file

3. Now, you can use the `FeedbackButton` component within your project.

4. Move the file located in the `api/feedback` folder to your project's API endpoint folder.

5. Ensure that your project is properly configured to handle the `/api/feedback/upload` endpoint. Adjust the endpoint path based on your project's API routing.

## Dependencies
List of the dependencies inferred from the code:

### React and related packages:
- react: The core React library.
- react-dom: For rendering React components in the DOM.
- react-hook-form: Used for managing forms in React.
- @hookform/resolvers/yup: Integration with Yup for form validation.
- react-scripts: Necessary for scripts such as react-scripts start.

```
npm install react react-dom react-hook-form @hookform/resolvers/yup react-scripts
```
### Material-UI and Icons:
- @mui/material: Material-UI library for React.
- @mui/icons-material: Material-UI icons.

```
npm install @mui/material @mui/icons-material
```

### Apollo Client:
- @apollo/client: Apollo Client for GraphQL communication.

```
npm install @apollo/client
```

### Yup: for schema validation.

```
npm install yup
```

### Others:
- html2canvas: Used for capturing screenshots of the HTML content.
- typescript: If not already installed, as some of the code snippets use TypeScript features.

```
npm install html2canvas typescript
```

### Development Dependencies (for Next.js projects):
- next: If the project uses Next.js.
- next-images: For handling images in Next.js.
- @types/react: TypeScript types for React.
- @types/node: TypeScript types for Node.js.

```
npm install --save-dev next next-images @types/react @types/node
```

