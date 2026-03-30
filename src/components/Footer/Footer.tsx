// ================ Footer Component ================

import { ShoppingCart, Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* ================ Brand ================ */}
          <div className="footer-section">
            <div className="footer-brand">
              <ShoppingCart className="brand-icon" />
              <span className="brand-name">E-Shop</span>
            </div>
            <p className="brand-description">
              Your premier destination for quality products and exceptional shopping experience.
            </p>
          </div>

          {/* ================ Quick Links ================ */}
          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <div className="footer-links">
              <Button variant="link" className="footer-link">
                About Us
              </Button>
              <Button variant="link" className="footer-link">
                Shop
              </Button>
              <Button variant="link" className="footer-link">
                Contact
              </Button>
              <Button variant="link" className="footer-link">
                Track Order
              </Button>
            </div>
          </div>

          {/* ================ Customer Service ================ */}
          <div className="footer-section">
            <h3 className="footer-heading">Customer Service</h3>
            <div className="footer-links">
              <Button variant="link" className="footer-link">
                Shipping Info
              </Button>
              <Button variant="link" className="footer-link">
                Returns
              </Button>
              <Button variant="link" className="footer-link">
                FAQ
              </Button>
              <Button variant="link" className="footer-link">
                Support
              </Button>
            </div>
          </div>

          {/* ================ Newsletter ================ */}
          <div className="footer-section">
            <h3 className="footer-heading">Stay Updated</h3>
            <p className="newsletter-description">
              Get exclusive offers and updates delivered to your inbox.
            </p>
            <div className="newsletter-form">
              <Input placeholder="Enter your email" className="newsletter-input" />
              <Button size="sm">Subscribe</Button>
            </div>
          </div>
        </div>

        <Separator className="footer-separator" />

        {/* ================ Contact Info ================ */}
        <div className="footer-contact">
          <div className="contact-item">
            <MapPin className="contact-icon" />
            <span>123 E-Shop Street, Commerce City</span>
          </div>
          <div className="contact-item">
            <Phone className="contact-icon" />
            <span>(555) 123-4567</span>
          </div>
          <div className="contact-item">
            <Mail className="contact-icon" />
            <span>support@eshop.com</span>
          </div>
        </div>

        <Separator className="footer-separator" />

        {/* ================ Bottom Bar ================ */}
        <div className="footer-bottom">
          <p className="copyright">
            © 2026 E-Shop. All rights reserved.
          </p>
          <div className="developer-credit">
            <span>Developed by </span>
            <a 
              href="https://ahmed-salem-resume.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="developer-link"
            >
              Ahmed Salem
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
