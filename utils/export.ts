import ExcelJS from "exceljs";

export async function exportConversationsToExcel(conversations: any[], users: {id: number, name: string}[], metricName: string) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Results");
  worksheet.addRow(["Conversation ID", ...users.map(u => u.name)]);
  conversations.forEach((conv: any) => {
    const row = [conv.id];
    users.forEach(user => {
      const annotation = (conv.Annotation as any[]).find((a: any) => a.userId === user.id);
      row.push(annotation?.verdict ?? "-");
    });
    worksheet.addRow(row);
  });
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      row.eachCell(cell => {
        cell.font = { bold: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFEFEFEF" }
        };
      });
    } else {
      row.eachCell((cell, colNumber) => {
        if (colNumber === 1) return;
        if (cell.value === "pass") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFBBF7D0" }
          };
          cell.font = { color: { argb: "FF166534" } };
        } else if (cell.value === "fail") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFECACA" }
          };
          cell.font = { color: { argb: "FF991B1B" } };
        }
      });
    }
  });
  const buf = await workbook.xlsx.writeBuffer();
  return new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}
