import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ACCENT = "#51bdcb";
const TEXT = "#333333";
const ACCENT_LIGHT = "#e8f6f8";

type RankingRow = {
  rank: number;
  playerName: string;
  wins: string;
  goalAverage: string;
  pointsScored: number;
};

function drawHeaderBar(doc: jsPDF, pageWidth: number) {
  doc.setFillColor(ACCENT);
  doc.rect(0, 0, pageWidth, 6, "F");
}

function drawLogo(
  doc: jsPDF,
  logoDataUrl: string,
  pageWidth: number,
  y: number
): number {
  const logoW = 48;
  const logoH = 12;
  doc.addImage(logoDataUrl, "PNG", (pageWidth - logoW) / 2, y, logoW, logoH);
  return y + logoH + 4;
}

function drawAppTitle(doc: jsPDF, pageWidth: number, y: number): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(ACCENT);
  doc.text("IPACOINCHE", pageWidth / 2, y, { align: "center" });
  return y + 6;
}

function drawTournamentTitle(
  doc: jsPDF,
  name: string,
  pageWidth: number,
  y: number
): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(TEXT);
  doc.text(name, pageWidth / 2, y, { align: "center" });
  return y + 10;
}

function drawMeta(
  doc: jsPDF,
  meta: string,
  pageWidth: number,
  y: number
): number {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(130, 130, 130);
  doc.text(meta, pageWidth / 2, y, { align: "center" });
  return y + 10;
}

function drawSectionTitle(doc: jsPDF, title: string, y: number): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(TEXT);
  doc.text(title, 20, y);

  doc.setDrawColor(ACCENT);
  doc.setLineWidth(1.5);
  doc.line(20, y + 2, 80, y + 2);

  return y + 10;
}

export function generateRecapPdf({
  tournamentName,
  tournamentDate,
  totalPlayers,
  totalValidatedTables,
  ranking,
  logoDataUrl,
  podiumImageDataUrl,
}: {
  tournamentName: string;
  tournamentDate: string | null;
  totalPlayers: number;
  totalValidatedTables: number;
  ranking: RankingRow[];
  logoDataUrl: string;
  podiumImageDataUrl: string | null;
}) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  drawHeaderBar(doc, pageWidth);

  let y = 14;
  if (logoDataUrl) {
    y = drawLogo(doc, logoDataUrl, pageWidth, y);
  }
  y = drawAppTitle(doc, pageWidth, y);
  y += 4;
  y = drawTournamentTitle(doc, tournamentName, pageWidth, y);

  const metaParts = [
    tournamentDate,
    `${totalPlayers} joueurs`,
    `${totalValidatedTables} tables validées`,
  ].filter(Boolean);
  y = drawMeta(doc, metaParts.join("  -  "), pageWidth, y);

  if (podiumImageDataUrl) {
    y += 2;
    y = drawSectionTitle(doc, "Podium", y);

    const imgW = pageWidth - 40;
    const imgH = imgW * (340 / 800);
    doc.addImage(podiumImageDataUrl, "PNG", 20, y, imgW, imgH);
    y += imgH + 6;
  }

  y += 4;
  y = drawSectionTitle(doc, "Classement complet", y);

  autoTable(doc, {
    startY: y,
    margin: { left: 20, right: 20 },
    head: [["#", "Joueur", "Victoires", "GA", "Points"]],
    body: ranking.map((r) => [
      r.rank,
      r.playerName,
      r.wins,
      r.goalAverage,
      r.pointsScored,
    ]),
    headStyles: {
      fillColor: ACCENT,
      textColor: "#ffffff",
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: 3,
    },
    bodyStyles: {
      textColor: TEXT,
      fontSize: 9,
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: ACCENT_LIGHT,
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 12 },
      1: { cellWidth: "auto" },
      2: { halign: "center", cellWidth: 24 },
      3: { halign: "center", cellWidth: 20 },
      4: { halign: "center", cellWidth: 22 },
    },
    styles: {
      lineWidth: 0,
      overflow: "linebreak",
    },
    theme: "plain",
    didDrawPage: (data) => {
      const pg = data.pageNumber;
      if (pg > 1) {
        drawHeaderBar(doc, pageWidth);
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(160, 160, 160);
      doc.text(
        `Ipacoinche - ${tournamentName}`,
        20,
        doc.internal.pageSize.getHeight() - 8
      );
      doc.text(
        `Page ${pg}`,
        pageWidth - 20,
        doc.internal.pageSize.getHeight() - 8,
        { align: "right" }
      );
    },
  });

  doc.setDrawColor(ACCENT);
  doc.setLineWidth(0.5);
  const footerY = doc.internal.pageSize.getHeight() - 16;
  doc.line(20, footerY, pageWidth - 20, footerY);

  const filename = `recap-${tournamentName.replace(/\s+/g, "-").toLowerCase()}.pdf`;
  doc.save(filename);
}
