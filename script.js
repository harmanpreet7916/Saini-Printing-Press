document.addEventListener('DOMContentLoaded', () => {
    const designsGrid = document.querySelector('.designs-grid');
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const buyNowButton = document.getElementById('buy-now-button');
    const shareDesignButton = document.getElementById('share-design-button');
    const closeButton = document.querySelector('.close-button');

    const yourWhatsAppNumber = '917591013000'; // Replace with your WhatsApp number including country code without '+'
    
    let currentDesign = null; // Store current design for sharing

    // Helper function to get the correct image URL
    function getImageUrl(imagePath) {
        // If it's already a full URL (http/https), return as is
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        
        // If it starts with 'images/', it's a local file
        if (imagePath.startsWith('images/')) {
            return imagePath;
        }
        
        // If it's just a filename, assume it's in the images folder
        if (!imagePath.includes('/') && !imagePath.startsWith('http')) {
            return `images/${imagePath}`;
        }
        
        return imagePath;
    }

    // Helper function to get full URL for sharing
    function getFullImageUrl(imagePath) {
        const imageUrl = getImageUrl(imagePath);
        
        // If it's a local image, make it a full URL
        if (!imageUrl.startsWith('http')) {
            const currentUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
            return currentUrl + imageUrl;
        }
        
        return imageUrl;
    }

    // Fetch designs from a JSON file
    fetch('designs.json')
        .then(response => response.json())
        .then(designs => {
            designs.forEach(design => {
                const designCard = document.createElement('div');
                designCard.classList.add('design-card');
                const imageUrl = getImageUrl(design.image);
                designCard.innerHTML = `
                    <img src="${imageUrl}" alt="${design.name}" onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Found'">
                    <div class="design-info">
                        <h3>${design.name}</h3>
                        <p>${design.description || 'Complete design package'}</p>
                        <div class="design-price">₹${design.price}</div>
                        <button class="add-to-cart">Add to Cart</button>
                    </div>
                `;
                designCard.addEventListener('click', () => openModal(design));
                designsGrid.appendChild(designCard);
            });
        })
        .catch(error => {
            console.error('Error loading designs:', error);
            // Add some placeholder designs if JSON fails to load
            const placeholderDesigns = [
                { name: 'Wedding Card Design', price: 500, image: 'https://via.placeholder.com/400x300?text=Wedding+Card', description: 'Elegant wedding invitation design' },
                { name: 'Business Hoarding', price: 2500, image: 'https://via.placeholder.com/400x300?text=Hoarding', description: 'Professional business hoarding' },
                { name: 'Custom T-Shirt', price: 300, image: 'https://via.placeholder.com/400x300?text=T-Shirt', description: 'Custom printed t-shirt design' }
            ];
            
            placeholderDesigns.forEach(design => {
                const designCard = document.createElement('div');
                designCard.classList.add('design-card');
                designCard.innerHTML = `
                    <img src="${design.image}" alt="${design.name}">
                    <div class="design-info">
                        <h3>${design.name}</h3>
                        <p>${design.description}</p>
                        <div class="design-price">₹${design.price}</div>
                        <button class="add-to-cart">Add to Cart</button>
                    </div>
                `;
                designCard.addEventListener('click', () => openModal(design));
                designsGrid.appendChild(designCard);
            });
        });

    function openModal(design) {
        currentDesign = design; // Store for sharing
        const imageUrl = getImageUrl(design.image);
        modalImage.src = imageUrl;
        modalTitle.textContent = design.name;
        modalPrice.textContent = `₹${design.price}`;
        
        // Create a detailed message with design information and image link
        const designLink = getFullImageUrl(design.image);
        
        const message = `🎨 Hi! I'm interested in buying this design:

📋 *Design Details:*
• Name: ${design.name}
• Price: ₹${design.price}
${design.description ? `• Description: ${design.description}` : ''}

🖼️ *Design Image:*
${designLink}

📱 Please confirm availability and share any additional details.

Thank you! 🙏`;
        
        const whatsappUrl = `https://wa.me/${yourWhatsAppNumber}?text=${encodeURIComponent(message)}`;
        
        buyNowButton.href = whatsappUrl;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Share design functionality
    function shareDesign(design) {
        const designLink = getFullImageUrl(design.image);
        
        const shareData = {
            title: `${design.name} - Saini Printing Press`,
            text: `Check out this amazing ${design.name} design for just ₹${design.price}!`,
            url: designLink
        };

        // Try native Web Share API first (mobile devices)
        if (navigator.share) {
            navigator.share(shareData).catch(err => {
                console.log('Error sharing:', err);
                fallbackShare(design, designLink);
            });
        } else {
            // Fallback for desktop
            fallbackShare(design, designLink);
        }
    }

    // Fallback share options
    function fallbackShare(design, designLink) {
        const shareText = `🎨 Check out this amazing design: ${design.name} for just ₹${design.price}!\n\n🖼️ View design: ${designLink}\n\n📱 Order now: https://wa.me/${yourWhatsAppNumber}`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            // Show success message
            showShareMessage('Design link copied to clipboard! 📋');
        }).catch(() => {
            // If clipboard fails, show the text in a popup
            const popup = window.open('', '_blank', 'width=400,height=300');
            popup.document.write(`
                <html>
                    <head><title>Share Design</title></head>
                    <body style="font-family: Arial; padding: 20px;">
                        <h3>Share this design:</h3>
                        <textarea readonly style="width: 100%; height: 150px;">${shareText}</textarea>
                        <p><small>Copy the text above to share</small></p>
                    </body>
                </html>
            `);
        });
    }

    // Show share success message
    function showShareMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #25D366;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10001;
            font-family: Inter, sans-serif;
            font-size: 14px;
        `;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Add event listener for share button
    if (shareDesignButton) {
        shareDesignButton.addEventListener('click', () => {
            if (currentDesign) {
                shareDesign(currentDesign);
            }
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
});
