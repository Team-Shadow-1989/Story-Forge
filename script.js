<script>
        const promptInput = document.getElementById('prompt');
        const genreSelect = document.getElementById('genre');
        const lengthSelect = document.getElementById('length');
        const generateBtn = document.getElementById('generateBtn');
        const loading = document.getElementById('loading');
        const outputSection = document.getElementById('outputSection');
        const storyTitle = document.getElementById('storyTitle');
        const storyText = document.getElementById('storyText');
        const copyBtn = document.getElementById('copyBtn');
        const regenerateBtn = document.getElementById('regenerateBtn');

        // Smooth scroll for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        async function generateStory() {
            const prompt = promptInput.value.trim();
            const genre = genreSelect.value;
            const length = lengthSelect.value;

            if (!prompt) {
                alert('Please enter a story idea!');
                return;
            }

            generateBtn.disabled = true;
            loading.classList.add('active');
            outputSection.classList.remove('active');

            try {
                const lengthGuide = {
                    short: '200 words',
                    medium: '400 words',
                    long: '600 words'
                };

                const response = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'claude-sonnet-4-20250514',
                        max_tokens: 1000,
                        messages: [{
                            role: 'user',
                            content: `Write a creative ${genre} story based on this idea: "${prompt}". 
                            
Make it approximately ${lengthGuide[length]} long. Write in an engaging, vivid style with good pacing. Include dialogue if appropriate. Make it complete with a beginning, middle, and end.

Format: Just write the story directly, no title or preamble needed.`
                        }]
                    })
                });

                const data = await response.json();
                const story = data.content[0].text;

                storyTitle.textContent = `Your ${genre.charAt(0).toUpperCase() + genre.slice(1)} Story`;
                storyText.textContent = story;
                
                loading.classList.remove('active');
                outputSection.classList.add('active');
                generateBtn.disabled = false;

            } catch (error) {
                console.error('Error:', error);
                alert('Failed to generate story. Please try again!');
                loading.classList.remove('active');
                generateBtn.disabled = false;
            }
        }

        function copyStory() {
            const story = storyText.textContent;
            navigator.clipboard.writeText(story).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✅ Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            });
        }

        generateBtn.addEventListener('click', generateStory);
        regenerateBtn.addEventListener('click', generateStory);
        copyBtn.addEventListener('click', copyStory);

        promptInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                generateStory();
            }
        });
    </script>