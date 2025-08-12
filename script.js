document.addEventListener('DOMContentLoaded', () => {
    const designsGrid = document.querySelector('.designs-grid');
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const buyNowButton = document.getElementById('buy-now-button');
    const closeButton = document.querySelector('.close-button');

    const yourWhatsAppNumber = '917591013000'; // Replace with your WhatsApp number including country code without '+'

    // Fetch designs from a JSON file
    fetch('designs.json')
        .then(response => response.json())
        .then(designs => {
            designs.forEach(design => {
                const designCard = document.createElement('div');
                designCard.classList.add('design-card');
                designCard.innerHTML = `
                    <img src="${design.image}" alt="${design.name}">
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
        modalImage.src = design.image;
        modalTitle.textContent = design.name;
        modalPrice.textContent = `₹${design.price}`;
        
        const message = `Hi, I'm interested in buying the "${design.name}" design for ₹${design.price}.`;
        const whatsappUrl = `https://wa.me/${yourWhatsAppNumber}?text=${encodeURIComponent(message)}`;
        
        buyNowButton.href = whatsappUrl;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

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
