"""
PDF & Printable Document Generator for Pastures Gardening
Generates professional branded Quotes and VAT Invoices.
"""
import io

def generate_invoice_html(invoice_data):
    """
    Renders an HTML invoice document styled with British estate typography.
    """
    items_rows = "".join([
        f"""
        <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #e7e5e4;">
                <strong>{item.get('description', '')}</strong>
                <div style="font-size: 11px; color: #78716c;">Category: {item.get('category', '')}</div>
            </td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #e7e5e4; text-align: center;">
                {item.get('quantity', 1)} {item.get('unit', '')}
            </td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #e7e5e4; text-align: right; font-family: monospace;">
                £{float(item.get('unitPrice', 0)):.2f}
            </td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #e7e5e4; text-align: right; font-family: monospace; font-weight: bold;">
                £{float(item.get('total', 0)):.2f}
            </td>
        </tr>
        """
        for item in invoice_data.get('lineItems', [])
    ])

    status_color = '#047857' if invoice_data.get('paymentStatus') == 'paid' else '#b45309'
    status_label = 'PAID IN FULL' if invoice_data.get('paymentStatus') == 'paid' else 'OUTSTANDING / DUE'

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Invoice {invoice_data.get('invoiceNumber', '')} - Pastures Gardening</title>
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                color: #1c1917;
                line-height: 1.5;
                padding: 40px;
                max-width: 800px;
                margin: auto;
                background: #ffffff;
            }}
            .header {{
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                border-bottom: 2px solid #064e3b;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }}
            .brand {{
                font-family: Georgia, serif;
                font-size: 26px;
                font-weight: bold;
                color: #064e3b;
            }}
            .badge {{
                display: inline-block;
                padding: 4px 12px;
                border-radius: 9999px;
                font-size: 11px;
                font-weight: bold;
                letter-spacing: 0.05em;
                color: white;
                background: {status_color};
            }}
            table {{
                width: 100%;
                border-collapse: collapse;
                margin: 24px 0;
            }}
            th {{
                background: #f5f5f4;
                padding: 10px 12px;
                text-align: left;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: #57534e;
                border-bottom: 2px solid #d6d3d1;
            }}
            .totals {{
                margin-left: auto;
                width: 300px;
                margin-top: 20px;
            }}
            .totals-row {{
                display: flex;
                justify-content: space-between;
                padding: 6px 0;
                font-size: 13px;
                color: #44403c;
            }}
            .totals-grand {{
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                font-size: 18px;
                font-weight: bold;
                color: #064e3b;
                border-top: 2px solid #064e3b;
                border-bottom: 2px solid #064e3b;
                margin-top: 8px;
            }}
            .footer {{
                margin-top: 50px;
                padding-top: 20px;
                border-top: 1px solid #e7e5e4;
                font-size: 11px;
                color: #78716c;
                text-align: center;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <div>
                <div class="brand">Pastures Gardening</div>
                <div style="font-size: 12px; color: #57534e; margin-top: 4px;">Grounds Maintenance & Horticultural Services</div>
                <div style="font-size: 11px; color: #78716c;">VAT Reg: GB 924 8102 33 | Reg No: 10842911</div>
            </div>
            <div style="text-align: right;">
                <div class="badge">{status_label}</div>
                <div style="font-size: 18px; font-weight: bold; margin-top: 8px; font-family: monospace;">
                    {invoice_data.get('invoiceNumber', '')}
                </div>
                <div style="font-size: 12px; color: #57534e;">Date: {invoice_data.get('issueDate', '')}</div>
                <div style="font-size: 12px; color: #57534e;">Due: {invoice_data.get('dueDate', '')}</div>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 24px;">
            <div>
                <strong style="font-size: 12px; text-transform: uppercase; color: #78716c;">Billed To:</strong>
                <div style="font-size: 15px; font-weight: bold; color: #1c1917; margin-top: 2px;">
                    {invoice_data.get('customerName', '')}
                </div>
                <div style="font-size: 13px; color: #44403c; max-width: 280px;">
                    {invoice_data.get('customerAddress', '')}
                </div>
                <div style="font-size: 12px; color: #78716c;">{invoice_data.get('customerEmail', '')}</div>
            </div>
            <div style="text-align: right;">
                <strong style="font-size: 12px; text-transform: uppercase; color: #78716c;">Remit Payment To:</strong>
                <div style="font-size: 13px; color: #44403c; margin-top: 2px;">Pastures Gardening Ltd.</div>
                <div style="font-size: 12px; color: #78716c;">Sort Code: 40-18-22</div>
                <div style="font-size: 12px; color: #78716c;">Account: 72910483</div>
                <div style="font-size: 12px; color: #78716c;">IBAN: GB42BARC40182272910483</div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="width: 50%;">Service Description</th>
                    <th style="width: 15%; text-align: center;">Qty / Unit</th>
                    <th style="width: 15%; text-align: right;">Rate (£)</th>
                    <th style="width: 20%; text-align: right;">Total (£)</th>
                </tr>
            </thead>
            <tbody>
                {items_rows}
            </tbody>
        </table>

        <div class="totals">
            <div class="totals-row">
                <span>Services Subtotal:</span>
                <span style="font-family: monospace;">£{float(invoice_data.get('subtotal', 0)):.2f}</span>
            </div>
            <div class="totals-row">
                <span>Eco Green Waste Disposal:</span>
                <span style="font-family: monospace;">£{float(invoice_data.get('greenWasteFee', 0)):.2f}</span>
            </div>
            <div class="totals-row">
                <span>VAT (20%):</span>
                <span style="font-family: monospace;">£{float(invoice_data.get('taxVat', 0)):.2f}</span>
            </div>
            <div class="totals-grand">
                <span>Total Amount Due:</span>
                <span style="font-family: monospace;">£{float(invoice_data.get('total', 0)):.2f}</span>
            </div>
        </div>

        <div class="footer">
            Thank you for entrusting Pastures Gardening with your estate grounds.<br>
            The Estate Yard, Chipping Campden, Cotswolds GL55 6HB • Tel: +44 (0) 1386 840 922
        </div>
    </body>
    </html>
    """
    return html

def generate_invoice_pdf(invoice_data):
    """
    Returns PDF bytes stream. If ReportLab or WeasyPrint is installed, compiles binary PDF;
    otherwise returns clean HTML bytes suitable for browser PDF printing.
    """
    html_content = generate_invoice_html(invoice_data)
    try:
        from weasyprint import HTML
        pdf_bytes = HTML(string=html_content).write_pdf()
        return pdf_bytes
    except Exception:
        # Fallback to UTF-8 encoded HTML stream ready for print-to-pdf
        return html_content.encode('utf-8')
