
export function calculateTotalPurchasePrice(purchaseOrderData) {
    let totalPurchasePrice = 0;
  
    if (purchaseOrderData && purchaseOrderData.purchaseOrderDetails) {
      const purchaseOrderDetails = purchaseOrderData.purchaseOrderDetails;
      
      for (const detail of purchaseOrderDetails) {
        if (detail.PurchasePrice) {
          totalPurchasePrice += parseFloat(detail.PurchasePrice);
        }
      }
    }
  
    return totalPurchasePrice;
  }