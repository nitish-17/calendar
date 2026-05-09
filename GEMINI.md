# Evolution & Context Management

This project follows an incremental, documentation-driven development process. Context is managed organically through a sequential specification and logging system.

### The `specs` Workflow

- **Requirement Files:** All features and requirements are housed in the `/specs` directory as Markdown files.
- **Sequential Versioning:** Files are prefixed with numerical identifiers (e.g., `001_auth.md`, `002_chat_loop.md`) to represent the chronological order of implementation.
- **Human-Driven Input:** Each file begins with the user's specific requirements or feature requests for the Gemini CLI.

### Automated System Logging

Upon the successful implementation of a feature, the Gemini CLI appends a **System Log** to the corresponding spec file. This log serves as the project's "technical memory," detailing:

- **Architectural Decisions:** The "why" behind structural choices.
- **Code Delta:** Key changes, new class names, and modified logic.
- **Trade-offs:** Alternative paths considered and why specific logic was chosen.

### Benefits

This method ensures that both the user and the Gemini CLI maintain a shared, immutable history of the codebase. It allows the model to reference previous decisions accurately, reducing hallucinations and ensuring architectural consistency as the project scales.

### Initialization Workflow

When initializing a session, the Gemini CLI must systematically review the project's evolution:
1. Iterate through every file in the `/specs` directory, sorted numerically by filename.
2. For each file, read the user requirements (bullet points) located before the **System Log** section.
3. Skip the detailed **System Log** unless specific technical context is required later in the session.
4. Synthesize this information to establish a high-level understanding of the project's current status and feature set.
