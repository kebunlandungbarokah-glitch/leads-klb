export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { record, old_record, type } = req.body;

  let pesan = "";

  if (type === "INSERT") {
    pesan = `Lead baru masuk!\nNama: ${record.customer_name}\nKategori: ${record.category}\nAlamat: ${record.address}`;
  } else if (type === "UPDATE") {
    if (old_record.status !== record.status) {
      if (record.status === "Deal") {
        pesan = `DEAL!\nCustomer: ${record.customer_name}\nNilai: Rp${Number(record.deal_price).toLocaleString("id-ID")}`;
      } else {
        pesan = `Status berubah\nCustomer: ${record.customer_name}\n${old_record.status} -> ${record.status}`;
      }
    } else {
      pesan = `Data lead "${record.customer_name}" diupdate`;
    }
  }

  let fonnteResult = null;

  if (pesan) {
    const fonnteResponse = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: { Authorization: process.env.FONNTE_TOKEN },
      body: new URLSearchParams({
        target: process.env.WA_TARGET,
        message: pesan,
      }),
    });
    fonnteResult = await fonnteResponse.json();
    console.log("FONNTE RESPONSE:", JSON.stringify(fonnteResult));
  }

  res.status(200).json({ success: true, fonnteResult });
}
