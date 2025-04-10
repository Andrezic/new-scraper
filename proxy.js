const express = require('express');
const app = express();
const port = 4000;

app.use(express.static('public'));
app.use(express.json());

app.post('/trimite-lead', (req, res) => {
  const lead = req.body;

  const iframeHtml = `
    <html>
      <body>
        <iframe id="wixFrame" src="https://www.skywardflow.com/date-firma" style="width:0;height:0;border:0; border:none;"></iframe>
        <script>
          const data = ${JSON.stringify(lead)};
          const iframe = document.getElementById('wixFrame');
          iframe.onload = function() {
            iframe.contentWindow.postMessage(data, '*');
          };
        </script>
      </body>
    </html>
  `;

  res.send(iframeHtml);
});

app.listen(port, () => {
  console.log(\`🚀 Proxy cu iframe rulează pe portul \${port}\`);
});
