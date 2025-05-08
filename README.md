# coursera-gradecalc-extension

A lightweight Chrome extension that calculates and displays your current and projected grades on Coursera, based on weighted assignment scores. Instantly see your performance across graded and ungraded tasks directly within the Assignments page.

## Overview

Coursera does not currently provide a weighted average grade based on assignment weights and completions. This extension parses assignment tables on the Grades page, extracts weights and grades, and computes:

- **Current Grade**: The weighted average across graded assignments only.
- **Projected Grade**: The weighted average assuming full credit on remaining assignments.

The extension runs automatically when you view a Coursera course's "Grades" page and adds a summary of your performance at the top of the table.

## Installation

To install the extension:

1. Visit the Chrome Web Store listing:  
   [https://chrome.google.com/webstore/detail/COURSE-ID](https://chrome.google.com/webstore/detail/COURSE-ID)

2. Click "Add to Chrome" and confirm installation.

3. Navigate to any course’s “Grades” tab on Coursera. The grade summary will appear automatically.

## Development

To run or modify the extension locally:

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/coursera-gradecalc-extension.git
   cd coursera-gradecalc-extension
   ```

2. Open Chrome and go to `chrome://extensions/`.

3. Enable **Developer Mode** in the top right corner.

4. Click **Load unpacked** and select the extension directory.

5. Navigate to a Coursera course’s Grades page to see the extension in action.

## Contributing

Contributions are welcome and encouraged. To propose a change:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Brief description of changes"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request with a clear explanation of your changes.

### Areas for Contribution

- Support for alternative Coursera layouts or localization
- Firefox or other browser compatibility
- UI enhancements and accessibility improvements
- More features

## License

This project is licensed under the MIT License.

MIT License

Copyright (c) 2025 Joseph Jennings

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
