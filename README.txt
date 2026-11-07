SHOPEASE — ONLINE SHOPPING WEBSITE

1. OPEN IN VS CODE
   - Extract the ZIP file.
   - Open VS Code and choose File > Open Folder.
   - Select the shopease_enhanced folder.
   - Open index.html and choose "Open with Live Server".
   - You can also open index.html directly in a browser.

2. WEBSITE FILES
   - index.html : Page structure and content
   - style.css  : Responsive visual design
   - app.js     : Product display, search, filters, wishlist, cart and order summary

3. AVAILABLE FEATURES
   - Responsive homepage and navigation
   - Product collection across four categories
   - Product search
   - Category filtering
   - Price and name sorting
   - Wishlist / favourite products
   - Add to cart
   - Increase/decrease quantity and remove items
   - Cart subtotal
   - Checkout form with browser validation
   - Order summary confirmation
   - Cart and wishlist saved in the current browser
   - About and contact sections

4. PUBLISH WITH GITHUB PAGES
   - Create a PUBLIC GitHub repository named: shopease
   - Upload index.html, style.css and app.js directly to the repository root.
   - Open repository Settings > Pages.
   - Under "Build and deployment", choose "Deploy from a branch".
   - Select branch "main" and folder "/ (root)", then Save.
   - After deployment, your website address will be:
     https://YOUR-GITHUB-USERNAME.github.io/shopease/

5. CURRENT WEBSITE SCOPE
   - This version runs in the browser and does not use a server or database.
   - Cart and wishlist data are saved in the visitor's current browser.
   - It does not include customer accounts or a login system.
   - It does not connect to a real payment gateway.
   - The order form prepares a local order summary; it does not transmit orders to a store.
   - Product listings and prices can be edited in app.js.

6. FEATURE CHECKLIST
   [ ] Open the homepage
   [ ] Search for a product
   [ ] Select a category
   [ ] Change product sorting
   [ ] Save a product to wishlist
   [ ] Add products to the cart
   [ ] Increase/decrease quantity
   [ ] Remove a cart item
   [ ] Complete the order details form
   [ ] Refresh the page and check cart/wishlist persistence
