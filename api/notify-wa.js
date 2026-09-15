export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { record, old_record, type } = req.body;

  let pesan = "";
  if (type === "INSERT") {
    pesan = `🆕 Item/Proyek baru ditambahkan: ${record.nama}`;
  } else if (type === "UPDATE") {
    pesan = `🔄 Status "${record.nama}" berubah: ${old_record.status} → ${record.status}`;
    if (record.status === "Deal") {
      pesan = `✅ Proyek "${record.nama}" DEAL! 🎉`;
    }
  }

  await fetch("https://api.fonnte.com/send", {
    method: "POST",
    headers: { Authorization: process.env.FONNTE_TOKEN },
    body: new URLSearchParams({
      target: process.env.WA_TARGET,
      message: pesan,
    }),
  });

  res.status(200).json({ success: true });
}
