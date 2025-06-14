const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 5000; // You can choose any available port

app.use(cors());
app.use(express.json());

app.post('/execute', (req, res) => {
    const { code, language } = req.body;
    let command;
    let filename;

    switch (language) {
        case 'python':
            filename = `temp_${Date.now()}.py`;
            command = `python ${filename}`;
            break;
        case 'javascript':
            filename = `temp_${Date.now()}.js`;
            command = `node ${filename}`;
            break;
        case 'cpp':
            filename = `temp_${Date.now()}.cpp`;
            command = `g++ ${filename} -o temp_output && ./temp_output`;
            break;
        case 'java':
            filename = `temp_${Date.now()}.java`;
            command = `javac ${filename} && java -cp . temp_${Date.now().toString().slice(-5)}`; // Using slice to avoid long class names
            break;
        case 'typescript':
            filename = `temp_${Date.now()}.ts`;
            command = `ts-node ${filename}`; // Requires ts-node to be installed globally or locally
            break;
        case 'rust':
            filename = `temp_${Date.now()}.rs`;
            command = `rustc ${filename} -o temp_output_rust && ./temp_output_rust`;
            break;
        case 'go':
            filename = `temp_${Date.now()}.go`;
            command = `go run ${filename}`;
            break;
        default:
            return res.status(400).json({ output: 'Unsupported language' });
    }

    const filepath = path.join(__dirname, filename);

    fs.writeFile(filepath, code, (err) => {
        if (err) {
            console.error('Failed to write file:', err);
            return res.status(500).json({ output: 'Failed to write file' });
        }

        exec(command, { timeout: 10000, cwd: __dirname }, (error, stdout, stderr) => {
            // Clean up temporary files
            fs.unlink(filepath, (unlinkErr) => {
                if (unlinkErr) console.error('Failed to delete temp file:', unlinkErr);
            });

            if (language === 'cpp' || language === 'rust') {
                fs.unlink(path.join(__dirname, 'temp_output'), (unlinkErr) => {
                    if (unlinkErr) console.error('Failed to delete executable:', unlinkErr);
                });
            }
            if (language === 'java') {
                fs.unlink(path.join(__dirname, filename.replace('.java', '.class')), (unlinkErr) => {
                    if (unlinkErr) console.error('Failed to delete class file:', unlinkErr);
                });
            }


            if (error) {
                console.error(`exec error: ${error}`);
                return res.json({ output: stderr || error.message });
            }
            res.json({ output: stdout });
        });
    });
});

app.listen(port, () => {
    console.log(`Code execution server listening at http://localhost:${port}`);
});
