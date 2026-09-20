import os
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
            self.drawString(160, 810, "•   Generative AI Engineering: Foundations to Agentic Systems")
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
        self.drawString(145, 24, "— 12-Week Generative AI Engineering Certificate Program")
        
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
        "<font color='#4f46e5'><b>UNISOLE SKILL AI LABS</b></font> &nbsp;•&nbsp; <font color='#64748b'>PATHWAY 01 — FLAGSHIP SPEC</font>",
        ParagraphStyle('Badge', fontName='Helvetica-Bold', fontSize=8, leading=10, spaceAfter=4)
    ))
    story.append(Paragraph("Generative AI Engineering", title_style))
    story.append(Paragraph("From Foundations to Agentic AI Systems — A 12-Week Industry-Ready Program", subtitle_style))
    
    # Meta Info Box
    meta_data = [[
        Paragraph("<b>Duration:</b> 12 Weeks (3 Months)", meta_style),
        Paragraph("<b>Total Volume:</b> 132 Contact Hours", meta_style),
        Paragraph("<b>Format:</b> Theory + Hands-on Labs + Capstone", meta_style),
        Paragraph("<b>Level:</b> Foundations to Agentic AI", meta_style)
    ]]
    meta_table = Table(meta_data, colWidths=[125, 125, 155, 110])
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
        "This program takes students from data handling and backend engineering through classical NLP, deep sequence models, "
        "Transformers, and Retrieval-Augmented Generation, into LLMOps and Agentic AI. Rather than a set of disconnected exercises, "
        "the course follows a <b>single progressive build</b>: each week adds a new capability to a system the student carries forward, "
        "so that by the end of the program every student has a working, evaluated, deployed AI application.",
        body_style
    ))
    story.append(Paragraph(
        "<b>The Industry Learning Cycle:</b> Every topic follows the same rigorous learning cycle: "
        "<b>Concept → Architecture → Demonstration → Build → Break → Debug → Evaluate</b>. "
        "This ensures students don't just call an API — they understand why each architecture works and can defend their design choices in an interview.",
        body_style
    ))
    story.append(Spacer(1, 4))

    # 3. Program Structure Table
    story.append(Paragraph("Program Structure & Curriculum Breakdown", h2_style))
    struct_data = [
        [Paragraph("Component", table_header), Paragraph("Hours", table_header), Paragraph("Purpose & Focus", table_header)],
        [Paragraph("Theory / Concepts", table_cell_bold), Paragraph("66 h", table_cell), Paragraph("Understand why each architecture and system actually works", table_cell)],
        [Paragraph("Hands-on Labs", table_cell_bold), Paragraph("44 h", table_cell), Paragraph("Build and test individual modular pipeline and modeling components", table_cell)],
        [Paragraph("Projects / Capstone", table_cell_bold), Paragraph("18 h", table_cell), Paragraph("Integrate everything into one deployed, evaluated production system", table_cell)],
        [Paragraph("Evaluation / Defense", table_cell_bold), Paragraph("4 h", table_cell), Paragraph("Benchmark, test against regressions, and present/defend the final system", table_cell)],
    ]
    struct_table = Table(struct_data, colWidths=[120, 50, 345])
    struct_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1e293b')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')]),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(struct_table)
    story.append(Spacer(1, 6))

    # Prerequisites Table
    story.append(Paragraph("Technical Prerequisites", h2_style))
    prereq_data = [
        [Paragraph("Required (Pre-Course)", table_header), Paragraph("Not Required (We Teach These)", table_header)],
        [
            Paragraph("• Python (OOP & functional patterns)<br/>• Linear Algebra & Calculus (applied to ML)<br/>• Statistics for AI<br/>• Git & Linux fundamentals<br/>• Pandas / NumPy basics", table_cell),
            Paragraph("• Prior ML / Deep Learning experience<br/>• Cloud certification<br/>• Advanced distributed systems<br/>• Research publication experience", table_cell)
        ]
    ]
    prereq_table = Table(prereq_data, colWidths=[257, 258])
    prereq_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#334155')),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(prereq_table)
    story.append(Paragraph("<i>* Note: Students without a programming background can take an optional 8–10 hour Python, API, and Git bridge module before the program begins.</i>", ParagraphStyle('Footnote', fontName='Helvetica-Oblique', fontSize=7.5, textColor=colors.HexColor('#64748b'), spaceBefore=2)))
    
    story.append(Spacer(1, 10))

    # 4. Week-by-Week Syllabus (Weeks 1 to 12)
    story.append(Paragraph("Week-by-Week Curriculum (Weeks 1 to 12)", h2_style))

    weeks = [
        (
            "Week 1",
            "Data Engineering for AI",
            "Handling large/messy datasets, EDA strategy, data quality issues, Git workflows in team AI projects.",
            "Clean and profile a large real dataset with Pandas/NumPy; Git branching + PR workflow; Linux CLI drills."
        ),
        (
            "Week 2",
            "AI Backend Engineering I",
            "REST API design for ML/LLM serving, FastAPI vs Flask, request/response patterns for model inference.",
            "Build a FastAPI service that serves a model endpoint; add request validation and error handling."
        ),
        (
            "Week 3",
            "AI Backend Engineering II",
            "PostgreSQL fundamentals, Redis caching for AI apps, Docker, basic system design (rate limiting, caching, URL shortener pattern), logging/monitoring.",
            "Add Postgres + Redis to the Week 2 service; containerize with Docker; implement a rate limiter. Output: Dockerized AI backend — the industry-readiness gate before NLP/LLMs."
        ),
        (
            "Week 4",
            "NLP Foundations: Text Representation",
            "NLP challenges, tokenization, stemming/lemmatization, One-Hot Encoding, Bag of Words, TF-IDF.",
            "Build a text-cleaning pipeline with NLTK; implement BoW and TF-IDF from scratch and with sklearn."
        ),
        (
            "Week 5",
            "Word Embeddings & Sequence Models",
            "Word2Vec (CBOW/Skip-gram), Average Word2Vec, ANN vs RNN, why sequence models need memory, word embeddings as feature representation.",
            "Train Word2Vec on a custom corpus; build RNN and LSTM classifiers; compare LSTM vs GRU vs BiRNN on the same task."
        ),
        (
            "Week 6",
            "Seq2Seq & Attention",
            "Encoder-Decoder architecture, Seq2Seq, the fixed-context-vector bottleneck, the attention mechanism (Bahdanau/Luong).",
            "Build a toy Encoder-Decoder Seq2Seq model; implement attention on top of it and demonstrate the improvement."
        ),
        (
            "Week 7",
            "Transformers",
            "Self-attention, multi-head attention, positional encoding, why Transformers replaced RNNs.",
            "Fine-tune a pretrained Transformer (BERT) for classification; complete the evolution benchmark: BoW → Word2Vec → LSTM → Attention → Transformer."
        ),
        (
            "Week 8",
            "Embeddings, Vector Databases & Retrieval",
            "Embedding spaces for retrieval, FAISS/Chroma internals, BM25 (sparse) vs dense retrieval, hybrid search.",
            "Build embedding pipelines with FAISS and Chroma; implement hybrid BM25 + dense retrieval and compare recall."
        ),
        (
            "Week 9",
            "RAG, Prompt Engineering & LLM APIs",
            "RAG architecture and chunking strategies, few-shot/eval-driven prompt engineering, LLM APIs (OpenAI/Azure), evaluation metrics (faithfulness, relevance, latency, cost).",
            "Build a full end-to-end RAG pipeline; build an evaluation dashboard tracking those metrics per query."
        ),
        (
            "Week 10",
            "LangChain/LangGraph & LLMOps",
            "LangChain/LangGraph fundamentals, prompt/dataset versioning, experiment tracking, cost tracking, observability, guardrails, CI/CD for AI apps.",
            "Rebuild the RAG pipeline in LangChain/LangGraph; instrument it with versioning, observability, and a guardrail layer; set up a CI/CD eval-regression check."
        ),
        (
            "Week 11",
            "Agentic AI & Cloud Deployment",
            "Multi-step reasoning agents, tool-calling, memory, planning agents; AWS/Azure basics, Kubernetes fundamentals, scaling AI APIs.",
            "Build a tool-calling agent with memory using LangGraph; deploy the Week 9–10 system to cloud infra with autoscaling."
        ),
        (
            "Week 12",
            "Capstone",
            "Research methodology: problem framing, evaluation design, technical reporting.",
            "Student-chosen real problem (legal doc assistant, medical Q&A, disaster-response assistant, internal knowledge bot). Design → Build → Evaluate → Deploy → Report, then present and defend."
        )
    ]

    syllabus_table_data = [
        [
            Paragraph("Week", table_header),
            Paragraph("Module & Title", table_header),
            Paragraph("Key Concepts", table_header),
            Paragraph("Hands-on Practical Work", table_header)
        ]
    ]

    for wk, title, concepts, practical in weeks:
        syllabus_table_data.append([
            Paragraph(f"<b>{wk}</b>", table_cell_bold),
            Paragraph(f"<b>{title}</b>", table_cell_bold),
            Paragraph(concepts, table_cell),
            Paragraph(f"<i>{practical}</i>", table_cell)
        ])

    syllabus_table = Table(syllabus_table_data, colWidths=[45, 125, 175, 170])
    syllabus_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0f172a')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')]),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(syllabus_table)
    story.append(Spacer(1, 10))

    # 5. Capstone Project Requirements
    story.append(Paragraph("Capstone Project — End-to-End Production Agentic RAG System", h2_style))
    story.append(Paragraph(
        "Students tackle a student-chosen real problem (e.g. legal doc assistant, medical Q&A, disaster-response assistant, "
        "or enterprise internal knowledge bot) and execute the complete lifecycle: <b>Design → Build → Evaluate → Deploy → Report</b>.",
        body_style
    ))
    story.append(Paragraph("<b>Capstone Deliverables & Requirements:</b>", body_style))

    capstone_items = [
        "<b>Agent / RAG System:</b> Integrated architecture combining hybrid retrieval, dynamic tool calling, and stateful conversational memory.",
        "<b>Evaluation Framework:</b> Telemetry logging of critical metrics including accuracy, token cost, query latency, and guardrail safety.",
        "<b>Containerized Cloud Deployment:</b> Deployed on cloud infrastructure with autoscaling and reverse-proxy load balancing.",
        "<b>Documented Improvement Cycle:</b> Explicit versioned evolution demonstrating measurable gains from Version 1 to Version 2.",
        "<b>Technical Defense:</b> A formal research/technical report defending architecture choices and design decisions before an expert panel."
    ]
    for item in capstone_items:
        story.append(Paragraph(f"• &nbsp; {item}", bullet_style))

    story.append(Spacer(1, 8))

    # 6. Learning Outcomes
    story.append(Paragraph("Graduate Learning Outcomes", h2_style))
    story.append(Paragraph("By the conclusion of this program, students will be verified capable to:", body_style))

    outcomes_col1 = [
        "Build and containerize a production AI backend (FastAPI, Postgres, Redis, Docker)",
        "Explain and implement the NLP evolution from Bag-of-Words to Transformers",
        "Build sequence models (RNN, LSTM, GRU, BiRNN, Seq2Seq) and diagnose limits",
        "Implement attention mechanisms and fine-tune Transformer models (BERT)"
    ]
    outcomes_col2 = [
        "Build and evaluate RAG systems using vector databases and hybrid retrieval",
        "Apply LLMOps practices: versioning, observability, guardrails, CI/CD for AI",
        "Design and deploy agentic AI systems with tool-calling, memory, and planning",
        "Deploy AI systems to the cloud and defend a complete system end to end"
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
    target = os.path.join(os.path.dirname(__file__), '..', 'public', 'syllabi', 'cs-genai.pdf')
    build_pdf(target)
