const PDFDocument = require("pdfkit");

router.get("/invoice/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).send("Order not found");
    }

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${order._id}.pdf`
    );

    doc.pipe(res);

    // 🧾 Invoice content
    doc.fontSize(20).text("INVOICE", { align: "center" });

    doc.moveDown();
    doc.text(`Order ID: ${order._id}`);
    doc.text(`Name: ${order.name}`);
    doc.text(`Address: ${order.address}`);
    doc.text(`Phone: ${order.phone}`);
    doc.text(`Payment ID: ${order.paymentId}`);

    doc.moveDown();
    doc.text("Items:");

    order.items.forEach((item) => {
      doc.text(`${item.name} - ₹${item.price} x ${item.qty}`);
    });

    doc.moveDown();
    doc.text(`Total: ₹${order.total}`, { bold: true });

    doc.end();
  } catch (err) {
    console.log(err);
    res.status(500).send("Error generating invoice");
  }
});