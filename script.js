// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Dark/Light mode toggle
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply the saved theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update icon based on theme
    if (savedTheme === 'dark') {
        icon.classList.replace('fa-moon', 'fa-sun');
    }
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Toggle icon
        if (newTheme === 'dark') {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });
    
    // Print functionality
    document.getElementById('printBtn').addEventListener('click', () => {
        window.print();
    });

    // Add animation classes after load
    setTimeout(() => {
        const timeCards = document.querySelectorAll('.time-card');
        timeCards.forEach((card, index) => {
            card.style.animationDelay = `${0.1 * (index + 1)}s`;
        });
    }, 100);
});