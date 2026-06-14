import type { ReadingOutline, PositionOutline } from './readingTypes'

function positionBlock(label: string, pos: PositionOutline): string {
  const lines: string[] = [`**${label} — ${pos.cardNameEn}**`]

  if (pos.selectedMeaning) {
    lines.push(pos.selectedMeaning)
  } else {
    lines.push(`ไพ่ ${pos.cardNameEn} มีพลังงานที่น่าสนใจในช่วงนี้`)
  }

  if (pos.keywords.length > 0) {
    lines.push(`คีย์เวิร์ด: ${pos.keywords.slice(0, 4).join(' · ')}`)
  }

  if (pos.timingPeriod) {
    lines.push(`ช่วงเวลา: ${pos.timingPeriod}${pos.timingNote ? ` — ${pos.timingNote}` : ''}`)
  }

  return lines.join('\n')
}

export function createAlgorithmText(outline: ReadingOutline): string {
  const { querentInsight, situationExpansion, mainConclusion, patternInsights, questionText } =
    outline

  const sections: string[] = []

  if (questionText) {
    sections.push(`คำถาม: "${questionText}"`)
  }

  // Overview
  const overviewLines = ['**ภาพรวม**']
  if (patternInsights.insights.length > 0) {
    overviewLines.push(...patternInsights.insights)
  } else {
    overviewLines.push('การดูไพ่ครั้งนี้สะท้อนพลังงานและสถานการณ์ในช่วงปัจจุบัน')
  }
  sections.push(overviewLines.join('\n'))

  // Position 1
  sections.push(positionBlock('ตัวตนเจ้าชะตา', querentInsight))

  // Position 2
  sections.push(positionBlock('สถานการณ์ที่จะเกิดขึ้น / ตัวขยาย', situationExpansion))

  // Position 3
  sections.push(positionBlock('สรุปคำตอบ', mainConclusion))

  // Advice
  sections.push(
    '**คำแนะนำ**\n' +
      'การดูไพ่นี้เป็นเพียงการสะท้อนพลังงานในปัจจุบัน ไม่ใช่คำทำนายชะตาที่ตายตัว ' +
      'คุณมีอิสระในการเลือกเส้นทางของตนเองเสมอ ใช้ข้อมูลนี้เป็นแนวทางในการไตร่ตรอง ' +
      'ไม่ใช่เพื่อสร้างความกลัวหรือความหวังลม ๆ แล้ง ๆ'
  )

  return sections.join('\n\n')
}
