import React from "react";

const OrderInfo = ({ info }) => {
  const { barcodeID, sender, receiver, product } = info;

  return (
    <div className="order-info-popup">
      <div className="container">
        <h2>
          Order Code:{" "}
          <span onClick={() => navigator.clipboard.writeText(barcodeID)}>
            {barcodeID}
          </span>
        </h2>
        <div className="order-status-btns">
          <button>Sign</button>
          <button>Cancel</button>
          <button>Returned</button>
        </div>
        <div className="info-boxes">
          <div className="info-box">
            <h2>Sender Info</h2>
            <InfoBox obj={sender} />
          </div>
          <div className="info-box">
            <h2>Receiver Info</h2>
            <InfoBox obj={receiver} />
          </div>
          <div className="info-box">
            <h2>Product Info</h2>
            <InfoBox obj={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;

const InfoBox = ({ obj }) => {
  const definedObj = Object.keys(obj);
  return (
    <>
      {definedObj.map((key) => {
        return (
          <div className="content" key={key}>
            <h4>{key}</h4>
            <p>{obj[key]}</p>
          </div>
        );
      })}
    </>
  );
};
