# Jaybor — Bangladesh Kurti Outfits Storefront & Order Database

Transform the storefront into **Jaybor**, a lightweight, fast, and mobile-friendly Bangladesh Kurti outfits e-commerce platform styled in a soft, modern light red-purple ("pookie" classic) palette, with Cash on Delivery (COD) checkout in Bangladeshi Taka (`৳`) and a persistent database for outfit images, orders, and customer order details.

## User Review & Critical Decisions

> [!IMPORTANT]
> **Confirmed Choices from Clarification**
> - **Brand & Market**: **Jaybor** tailored for Bangladesh (`৳` BDT currency, `01XXXXXXXXX` mobile validation, Inside Dhaka `৳70` & Outside Dhaka `৳130` delivery rates).
> - **Catalog Focus**: **Kurti Outfits** — Everyday Pastel Cotton Kurtis, 2-Piece Kurti & Trouser Sets, Muslin Floral Kurtis, and Festive Embroidered 3-Piece Kurti Sets.
> - **Payment Method**: **Cash on Delivery (COD) Only** across all 64 districts of Bangladesh, with clear delivery charge and total payable on arrival.
> - **Database & Admin Scope**: Persistent database storing **Kurti outfit products (with images)**, **customer orders**, and **full customer order details** (ordered item image, customer name, BD phone number, district/area, street address, size, quantity, and COD status).

---

## 1. Overview & Core Concept

- **What It Does**: **Jaybor** allows customers across Bangladesh to browse curated Kurti outfits, inspect fabric and size details (`S`, `M`, `L`, `XL`, `XXL` with chest/length measurements in inches), place 1-step Cash on Delivery orders, and track their order status using their phone number or Order ID. Store owners can log into the **Jaybor Seller Desk** to view incoming customer order details (complete with ordered outfit thumbnails) and add or manage Kurti outfits in the database.
- **Target Audience / Persona**: Young women, university students, and professionals in Bangladesh looking for chic, comfortable, "pookie-aesthetic" pastel and berry-toned Kurti outfits with hassle-free Cash on Delivery.
- **Key Value**: Ultra-lightweight, smooth performance on both low-end and high-end mobile devices and desktops, paired with real-time database persistence so no customer order or product update is ever lost.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Browse & Filter Kurti Outfits**: Visitors land on a clean, airy hero showcase and immediately browse the 3-column (desktop) / 2-column (mobile) Kurti catalog. They can filter by style (*All Kurtis*, *Daily Cotton Kurti*, *2-Piece Kurti Set*, *Festive 3-Piece*, *Pookie Pastel Edition*) or search by color/fabric.
  2. **Quick Inspect & Size Selection**: Clicking any Kurti card opens a clean Contiguous Purchase Modal showing the high-resolution Kurti outfit image, Bangladeshi chest/length size chart (`36"–44"`), fabric details, and a direct **Order Cash on Delivery** or **Add to Bag** button.
  3. **Fast BD Cash on Delivery Checkout**: In the slide-over bag, customers choose their delivery zone (*Inside Dhaka — ৳70* or *Outside Dhaka — ৳130*, free on orders over `৳2,500`), enter their Name, Bangladesh Mobile Number (`01XXXXXXXXX`), District/Area, and Full Address, and confirm their COD order in one click.
  4. **Customer Order Tracking & Seller Database Desk**: Customers can look up their live order status by Order ID, while the business owner can open the **Jaybor Seller Desk** to view all customer order records (with outfit images, customer phone, address, and BDT totals), update delivery statuses, and add new Kurti outfits (with image URL or uploaded photo preview) directly to the database.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Light, simple, classic, and modern "pookie" boutique aesthetic—soft, welcoming, and clutter-free with lightweight CSS transitions that run smoothly on every device.
  - *Color Palette & Mood*:
    - `--background`: `#FFF9FB` (Soft Rose-Milk Alabaster — 60% dominant neutral canvas)
    - `--surface`: `#FCEEF4` / `#F7E2EC` (Light Red-Purple / Blush Lavender structural surfaces — 30%)
    - `--text-primary`: `#2A1621` (Deep Plum-Espresso for crisp WCAG AA contrast)
    - `--text-muted`: `#6E4B5E` (Muted Berry-Mauve for secondary copy)
    - `--primary` / `--accent`: `#A83264` to `#7E2852` (Modern Rose-Berry & Soft Mulberry Purple for primary CTAs and active states — 10% accent budget)
  - *Typography & Hierarchy*:
    - Display / Brand & Headings: `Cormorant Garamond` (classic, feminine, graceful serif)
    - Body & UI Controls: `Plus Jakarta Sans` (clean, legible geometric sans)
    - Prices, Phone Numbers & Order IDs: `JetBrains Mono` with `tabular-nums` for `৳` BDT amounts and quantities
  - *Component Styling & Layout*:
    - Strict 3-zone Top Bar Contract (`Jaybor` wordmark — 4 single-line links: *Kurti Collection*, *Size Guide*, *Track Order*, *Seller Desk* — 1 primary CTA: *Shopping Bag (N)*).
    - Zero-pill metadata discipline: unboxed text metadata with `·` separators; soft hairline borders (`#EDD5E1`) and single-elevation cards for fast mobile rendering.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Cash on Delivery (COD) First Workflow for Bangladesh**
  - *Chosen Approach*: Streamlined 1-step COD form tailored for Bangladesh (Name, 11-digit `01XXXXXXXXX` mobile number, Inside/Outside Dhaka delivery selector, District/Thana, and Street Address) with instant payable breakdown in `৳` BDT.
  - *Why*: In Bangladeshwomenswear e-commerce, over 85% of boutique orders are settled via Cash on Delivery; removing multi-page payment gateways dramatically increases mobile checkout speed and conversion.
- **Decision 2: Cloud Firestore Database with Automatic Seed & Offline-Safe Fallback**
  - *Chosen Approach*: Provision Firebase Firestore to persist the `outfits` catalog and `orders` (including ordered Kurti images and customer delivery details), paired with an automatic initial catalog seeder so the store is immediately populated with curated Kurti outfits.
  - *Why*: Ensures real multi-device persistence for the business owner while guaranteeing instant page loads and resilient operation.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        JAYBOR WEB APPLICATION                           │
│           (Light Red-Purple Modern Classic Theme · BDT ৳)               │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
┌───────────────────┐     ┌───────────────────┐     ┌─────────────────────┐
│ Storefront & Hero │     │ Contiguous Kurti  │     │ Slide-Over COD Bag  │
│  - Category Bar   │     │   Detail Modal    │     │  - Inside/Outside   │
│  - 3-Col Grid     │     │  - Image Plate    │     │    Dhaka Selector   │
│  - BD Size Guide  │     │  - Size (36"-44") │     │  - BD Phone Check   │
└─────────┬─────────┘     └─────────┬─────────┘     └──────────┬──────────┘
          │                         │                          │
          └─────────────────────────┼──────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│               DATA & COMMERCE SERVICE LAYER (TypeScript)                │
│  - BDT Pricing & Delivery Math    - BD Mobile & Address Validation      │
│  - Order Tracking Lookup          - Firestore Real-Time Sync + Seeder   │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
      ┌───────────────────────────┐   ┌───────────────────────────┐
      │  Firestore: /outfits/{id} │   │  Firestore: /orders/{id}  │
      │  - title, category, price │   │  - orderNumber, createdAt │
      │  - imageUrl, fabric       │   │  - customerName, phone    │
      │  - sizes[], stockCount    │   │  - address, deliveryZone  │
      └───────────────────────────┘   │  - items[] (with imageUrl)│
                                      │  - totalBdt, codStatus    │
                                      └───────────────────────────┘
```

### Data Model & State
- **`outfits` Collection**: Stores each Kurti outfit (`id`, `title`, `subtitle`, `category`, `priceBdt`, `originalPriceBdt`, `imageUrl`, `fabric`, `colorName`, `colorHex`, `sizes` (`S (36")`, `M (38")`, `L (40")`, `XL (42")`, `XXL (44")`), `stockCount`, `statusTag`).
- **`orders` Collection**: Stores every customer order (`orderId`, `createdAt`, `customerName`, `phone`, `district`, `address`, `deliveryZone` (`Inside Dhaka` | `Outside Dhaka`), `paymentMethod`: `'Cash on Delivery'`, `items` array containing each ordered Kurti's `outfitId`, `title`, `imageUrl`, `size`, `quantity`, and `unitPriceBdt`, plus `subtotalBdt`, `deliveryFeeBdt`, `discountBdt`, `totalBdt`, and `status`).

### Interactive Component & State Mapping
- **Catalog & Filter Bar**: Filters `outfits` by Kurti category and search text; sorts by Featured, Price Low-to-High, or Price High-to-Low.
- **Kurti Detail & Size Guide Modal**: Lets shoppers select their chest size (`36"` to `44"`), view garment length, and add directly to the COD bag.
- **COD Checkout Drawer**: Validates 11-digit Bangladesh mobile numbers (`^01[3-9]\d{8}$`), computes Inside Dhaka (`৳70`) or Outside Dhaka (`৳130`) courier fee (or `৳0` above `৳2,500`), writes the complete order with outfit images to the database, and displays a printable/saveable Order Confirmation card.
- **Jaybor Seller Desk & Order Tracker**: Allows customers to check order status by Order ID/Phone, and enables the business owner to inspect customer order details (with ordered Kurti images), update order delivery status (*Pending Verification*, *Confirmed*, *Sent to Steadfast/Pathao Courier*, *Delivered*), restock sizes, and publish new Kurti outfits with images to the database.
