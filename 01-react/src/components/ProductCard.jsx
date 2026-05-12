import React from "react";
import "./productCard.css";

export default function ProductCard({ image, name, price, onClick }) {
  return (
    <article
      className="product-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <img src={`https://picsum.photos/seed/prod${price}/600/400`} alt={name} className="product-image" />
      <div className="product-info">
        <h3 className="product-title">{name}</h3>
        <p className="product-price">Rp {price.toLocaleString("id-ID")}</p>
        <button className="btn">Lihat Detail</button>
      </div>
    </article>
  );
}
