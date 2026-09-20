import os
import shutil
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#4f46e5"))
            self.drawString(40, 810, "UNISOLE SKILL AI LABS")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748b"))
            self.drawString(160, 810, "•   AI Entrepreneurship & Innovation: Weekend Incubator Track")
            self.setStrokeColor(colors.HexColor("#e2e8f0"))
            self.setLineWidth(0.5)
            self.line(40, 802, 555, 802)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(0.5)
        self.line(40, 36, 555, 36)
        
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#0f172a"))
        self.drawString(40, 24, "UNISOLE Skill AI Labs")
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        self.drawString(145, 24, "— AI Entrepreneurship & Innovation Weekend Track")
        
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(555, 24, page_str)
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=46,
        bottomMargin=46
    )

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#4f46e5'),
        spaceAfter=6
    )
    
    meta_style = ParagraphStyle(
        'DocMeta',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#334155')
    )
    
    h2_style = ParagraphStyle(
        'Heading2Custom',
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=10,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor('#334155'),
        spaceAfter=5
    )

    table_header = ParagraphStyle(
        'TableHeader',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    table_cell = ParagraphStyle(
        'TableCell',
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#1e293b')
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#0f172a')
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor('#334155'),
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=2
    )

    story = []

    # 1. Header Hero Badge
    story.append(Paragraph(
        "<font color='#4f46e5'><b>UNISOLE SKILL AI LABS</b></font> &nbsp;•&nbsp; <font color='#64748b'>INCUBATOR LABS — WEEKEND TRACK</font>",
        ParagraphStyle('Badge', fontName='Helvetica-Bold', fontSize=8, leading=10, spaceAfter=4)
    ))
    story.append(Paragraph("AI Entrepreneurship & Innovation", title_style))
    story.append(Paragraph("Weekend Incubator Track — From AI Capability to a Validated Startup", subtitle_style))
    
    # Meta Info Box
    meta_data = [[
        Paragraph("<b>Duration:</b> 3 Months (12 Weekends)", meta_style),
        Paragraph("<b>Schedule:</b> Saturdays & Sundays only", meta_style),
        Paragraph("<b>Format:</b> Hands-on Incubator Labs", meta_style),
        Paragraph("<b>Fee:</b> ₹599 (All Students)", meta_style)
    ]]
    meta_table = Table(meta_data, colWidths=[130, 130, 145, 110])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 8))

    # 2. Program Overview
    story.append(Paragraph("Program Overview", h2_style))
    story.append(Paragraph(
        "This is a structured incubator track that teaches students how to convert AI technical capability into a "
        "validated commercial product and startup. Classes run <b>only on Saturdays and Sundays across 3 months</b>, "
        "so working students and full-time learners can join without disrupting their weekday academic or professional schedules.",
        body_style
    ))
    story.append(Paragraph(
        "The track follows a single build-as-you-learn pipeline: <b>Problem Statement → Functional MVP → Business Model → Final Pitch</b>. "
        "Every weekend adds a concrete artifact to this pipeline, so by demo day each student defends a working prototype, a validated business model, "
        "and an investor-ready pitch — not just lecture notes.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Core Skills Covered:</b> MVP Prototyping &nbsp;•&nbsp; Business Model Canvas &nbsp;•&nbsp; Investor Pitch Decks &nbsp;•&nbsp; Unit Economics & GTM Strategy",
        ParagraphStyle('CoreSkills', fontName='Helvetica-Bold', fontSize=8.5, leading=12, textColor=colors.HexColor('#4f46e5'), spaceAfter=4)
    ))
    story.append(Spacer(1, 4))

    # 3. Program Structure Table
    story.append(Paragraph("Program Structure & Modular Progression", h2_style))
    struct_data = [
        [Paragraph("Module", table_header), Paragraph("Schedule", table_header), Paragraph("Core Focus & Deliverable", table_header)],
        [Paragraph("01 — Problem & Market Discovery", table_cell_bold), Paragraph("Weekends 1–4", table_cell), Paragraph("Find and validate a real customer problem worth solving (Problem Statement Lock-In)", table_cell)],
        [Paragraph("02 — AI Opportunity & Rapid MVP", table_cell_bold), Paragraph("Weekends 5–8", table_cell), Paragraph("Identify high-value 10x AI use cases and build a working functional prototype", table_cell)],
        [Paragraph("03 — Business Model & Pitching", table_cell_bold), Paragraph("Weekends 9–11", table_cell), Paragraph("Turn the MVP into a scalable business model, unit economics, and fundable pitch", table_cell)],
        [Paragraph("Capstone Defense — Final Pitch", table_cell_bold), Paragraph("Weekend 12", table_cell), Paragraph("Present and defend the full venture before an investor-style evaluation panel", table_cell)],
    ]
    struct_table = Table(struct_data, colWidths=[140, 75, 300])
    struct_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1e293b')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')]),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(struct_table)
    story.append(Paragraph("<i>* Note: Classes are held strictly on Saturdays and Sundays for the full 3-month duration — no weekday commitments.</i>", ParagraphStyle('Footnote', fontName='Helvetica-Oblique', fontSize=7.5, textColor=colors.HexColor('#64748b'), spaceBefore=2)))
    story.append(Spacer(1, 8))

    # 4. Weekend-by-Weekend Syllabus (Weekends 1 to 12)
    story.append(Paragraph("Weekend-by-Weekend Syllabus (Weekends 1 to 12)", h2_style))

    weekends = [
        (
            "W1",
            "Weekend 1: Design Thinking & Pain Points",
            "Mod 1",
            "Saturday: Introduction to design thinking; empathy mapping; identifying real user pain points.<br/>"
            "Sunday: Hands-on: map 3 candidate pain points from your own experience or target community; peer critique.",
            "MILESTONE: Problem Statement initiation"
        ),
        (
            "W2",
            "Weekend 2: Customer Discovery Interviews",
            "Mod 1",
            "Saturday: Interview design: writing unbiased questions, avoiding leading the witness, structuring a discovery call.<br/>"
            "Sunday: Conduct 3–5 mock customer discovery interviews; synthesize findings into a problem brief.",
            "Problem brief synthesis from customer discovery"
        ),
        (
            "W3",
            "Weekend 3: Competitor Matrix & Market Sizing",
            "Mod 1",
            "Saturday: Competitive analysis frameworks; direct vs indirect competitors; positioning maps.<br/>"
            "Sunday: Workshop: build a competitor matrix and a TAM/SAM/SOM market-sizing estimate for your idea.",
            "Competitor matrix & TAM/SAM/SOM market model"
        ),
        (
            "W4",
            "Weekend 4: Problem Statement Lock-In",
            "Mod 1",
            "Saturday: Peer review of problem briefs, market sizing, and competitor matrices; instructor feedback.<br/>"
            "Sunday: Finalize and present a validated Problem Statement to the cohort.",
            "MILESTONE: Validated Problem Statement locked"
        ),
        (
            "W5",
            "Weekend 5: Where AI Creates 10x Value",
            "Mod 2",
            "Saturday: Framework for spotting AI opportunities vs plain automation; case studies of 10x value creation.<br/>"
            "Sunday: Opportunity-mapping exercise: apply the framework to your own validated problem.",
            "AI Opportunity-mapping & 10x value matrix"
        ),
        (
            "W6",
            "Weekend 6: Rapid Prototyping Toolkit",
            "Mod 2",
            "Saturday: Tour of low-code and AI-assisted build tools for fast prototyping.<br/>"
            "Sunday: Build the first clickable/functional version of your prototype.",
            "MILESTONE: Functional MVP first clickable build"
        ),
        (
            "W7",
            "Weekend 7: MVP Build Sprint",
            "Mod 2",
            "Saturday: Iterate on the prototype; add the core AI-driven feature.<br/>"
            "Sunday: Continue the build sprint; instructor office hours for debugging and scoping.",
            "Functional MVP build sprint & AI integration"
        ),
        (
            "W8",
            "Weekend 8: Validating the MVP",
            "Mod 2",
            "Saturday: Methods for testing an MVP with early users; structuring a feedback session.<br/>"
            "Sunday: Run live validation sessions with early users; collect and log feedback on your Functional MVP.",
            "MILESTONE: Functional MVP validated with users"
        ),
        (
            "W9",
            "Weekend 9: Business Model Canvas",
            "Mod 3",
            "Saturday: Business Model Canvas (BMC) fundamentals; revenue model options for AI products.<br/>"
            "Sunday: Build a complete BMC and revenue model for your validated MVP.",
            "Complete Business Model Canvas & unit economics"
        ),
        (
            "W10",
            "Weekend 10: Go-To-Market Strategy",
            "Mod 3",
            "Saturday: GTM frameworks: channels, positioning, early-adopter acquisition.<br/>"
            "Sunday: Build a GTM plan; finalize the Business Model.",
            "MILESTONE: Business Model & GTM plan locked"
        ),
        (
            "W11",
            "Weekend 11: Investor Pitch Deck",
            "Mod 3",
            "Saturday: Pitch deck structure and storytelling for investors; anatomy of a 10-slide deck.<br/>"
            "Sunday: Build a draft pitch deck; peer review and iterate.",
            "10-slide investor pitch deck draft & iteration"
        ),
        (
            "W12",
            "Weekend 12: Startup Validation & Pitch Deck",
            "Capstone",
            "Saturday: Pitch rehearsal; feedback session with instructors and mentors.<br/>"
            "Sunday: Final Pitch — capstone defense in front of an investor-style panel.",
            "MILESTONE: Final Pitch defended before panel"
        ),
    ]

    weekend_table_data = [
        [
            Paragraph("Weekend", table_header),
            Paragraph("Module & Title", table_header),
            Paragraph("Schedule & Topics (Saturday / Sunday)", table_header),
            Paragraph("Milestone Deliverable", table_header)
        ]
    ]

    for wk, title, mod, schedule, deliverable in weekends:
        weekend_table_data.append([
            Paragraph(f"<b>{wk}</b>", table_cell_bold),
            Paragraph(f"<b>{title}</b><br/><font color='#4f46e5'>{mod}</font>", table_cell),
            Paragraph(schedule, table_cell),
            Paragraph(f"<i>{deliverable}</i>", table_cell)
        ])

    weekend_table = Table(weekend_table_data, colWidths=[35, 130, 215, 135])
    weekend_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0f172a')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')]),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(weekend_table)
    story.append(Spacer(1, 10))

    # 5. Capstone Defense & Pipeline
    story.append(Paragraph("Capstone Defense — Startup Validation & Pitch Deck", h2_style))
    story.append(Paragraph(
        "Every student's work runs through one execution pipeline across the 12 weekends: "
        "<b>1. Problem Statement &nbsp;→&nbsp; 2. Functional MVP &nbsp;→&nbsp; 3. Business Model &nbsp;→&nbsp; 4. Final Pitch</b>.",
        body_style
    ))
    story.append(Paragraph("<b>Employer- & Investor-Ready Deliverables Produced:</b>", body_style))

    capstone_items = [
        "<b>Working MVP Prototype:</b> Functional, user-testable software product powered by an AI core feature.",
        "<b>Validated Business Model Canvas:</b> Tested unit economics, pricing strategy, customer segments, and revenue streams.",
        "<b>Go-To-Market (GTM) Playbook:</b> Actionable channel distribution and customer acquisition strategy.",
        "<b>10-Slide Investor Pitch Deck:</b> High-impact executive deck synthesized for pre-seed/angel investors.",
        "<b>Panel Defense:</b> On the final Sunday, each student defends their venture live before an investor-style panel."
    ]
    for item in capstone_items:
        story.append(Paragraph(f"• &nbsp; {item}", bullet_style))

    story.append(Spacer(1, 8))

    # 6. Learning Outcomes
    story.append(Paragraph("Graduate Learning Outcomes", h2_style))
    story.append(Paragraph("By the conclusion of this incubator track, students will be verified capable to:", body_style))

    outcomes_col1 = [
        "Apply design thinking to identify and validate customer pain points",
        "Run structured customer discovery interviews and synthesize findings",
        "Build a competitor matrix and size a market (TAM/SAM/SOM)",
        "Distinguish where AI creates outsized value vs simple automation",
        "Rapidly prototype a functional MVP using low-code & AI tools"
    ]
    outcomes_col2 = [
        "Validate an MVP with early users and iterate on real feedback",
        "Build a Business Model Canvas and defensible revenue model",
        "Design a go-to-market strategy for an early-stage AI product",
        "Craft and deliver a high-impact, investor-ready pitch deck",
        "Defend a complete venture — problem, product, model, pitch — to a panel"
    ]

    outcomes_data = [[
        Paragraph("<br/>".join([f"✓ &nbsp; <b>{o}</b>" for o in outcomes_col1]), table_cell),
        Paragraph("<br/>".join([f"✓ &nbsp; <b>{o}</b>" for o in outcomes_col2]), table_cell)
    ]]
    outcomes_table = Table(outcomes_data, colWidths=[257, 258])
    outcomes_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f1f5f9')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(outcomes_table)

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated {filename}")

if __name__ == '__main__':
    target_cs = os.path.join(os.path.dirname(__file__), '..', 'public', 'syllabi', 'cs-common.pdf')
    target_g1 = os.path.join(os.path.dirname(__file__), '..', 'public', 'syllabi', 'G1-Common AI Entrepreneurship (Detailed).pdf')
    target_mgmt = os.path.join(os.path.dirname(__file__), '..', 'public', 'syllabi', 'mgmt-common.pdf')
    target_g3 = os.path.join(os.path.dirname(__file__), '..', 'public', 'syllabi', 'G3-Common AI Entrepreneurship (Detailed).pdf')

    build_pdf(target_cs)
    shutil.copyfile(target_cs, target_g1)
    shutil.copyfile(target_cs, target_mgmt)
    shutil.copyfile(target_cs, target_g3)
    print("Copied to all common syllabus destinations successfully.")
