import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
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
            self.drawString(160, 810, "•   AI Agent Engineering: From Fundamentals to Production")
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
        self.drawString(145, 24, "— 12-Week AI Agent Engineering Certificate Program")
        
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
    
    # Custom Typography
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

    body_bold = ParagraphStyle(
        'BodyBold',
        parent=body_style,
        fontName='Helvetica-Bold',
        textColor=colors.HexColor('#0f172a')
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
        "<font color='#4f46e5'><b>UNISOLE SKILL AI LABS</b></font> &nbsp;•&nbsp; <font color='#64748b'>PATHWAY 02 — ADVANCED SPEC</font>",
        ParagraphStyle('Badge', fontName='Helvetica-Bold', fontSize=8, leading=10, spaceAfter=4)
    ))
    story.append(Paragraph("AI Agent Engineering", title_style))
    story.append(Paragraph("From Fundamentals to Production — A 12-Week Certificate Program", subtitle_style))
    
    # Meta Info Box
    meta_data = [[
        Paragraph("<b>Duration:</b> 12 Weeks (3 Months)", meta_style),
        Paragraph("<b>Total Volume:</b> 132 Contact Hours", meta_style),
        Paragraph("<b>Format:</b> Theory + Hands-on Labs + Capstone", meta_style),
        Paragraph("<b>Level:</b> Production Engineering", meta_style)
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
        "This program takes students from the fundamentals of AI agents to designing, building, evaluating, and deploying "
        "a production-grade multi-agent system. Rather than a set of disconnected tutorials, the course follows a <b>single "
        "progressive build</b>: each week adds a new capability to a project the student carries forward, so that by the end of "
        "the program every student has a working, evaluated, portfolio-ready agent application.",
        body_style
    ))
    story.append(Paragraph(
        "<b>The Industry Learning Cycle:</b> Every topic follows a rigorous 7-stage learning cycle: "
        "<b>Concept → Architecture → Demonstration → Build → Break → Debug → Evaluate</b>. "
        "This ensures students don't just understand agents conceptually — they can build, test, and fix them the way it is done in production engineering.",
        body_style
    ))
    story.append(Spacer(1, 4))

    # 3. Program Structure & Prerequisites in 2 Columns
    story.append(Paragraph("Program Structure & Curriculum Breakdown", h2_style))
    
    struct_data = [
        [Paragraph("Component", table_header), Paragraph("Hours", table_header), Paragraph("Purpose & Focus", table_header)],
        [Paragraph("Theory / Concepts", table_cell_bold), Paragraph("66 h", table_cell), Paragraph("Understand how agent architectures and reasoning loops actually work", table_cell)],
        [Paragraph("Hands-on Labs", table_cell_bold), Paragraph("44 h", table_cell), Paragraph("Build and test individual modular components in sandboxed runtimes", table_cell)],
        [Paragraph("Projects / Capstone", table_cell_bold), Paragraph("18 h", table_cell), Paragraph("Integrate everything into one comprehensive production system", table_cell)],
        [Paragraph("Evaluation / Defense", table_cell_bold), Paragraph("4 h", table_cell), Paragraph("Benchmark, test against adversarial attacks, and defend the system", table_cell)],
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
        [Paragraph("Required Competencies", table_header), Paragraph("Not Required (We Teach These)", table_header)],
        [
            Paragraph("• Basic Python programming & logic<br/>• Git fundamentals & GitHub basics<br/>• APIs and JSON data structures<br/>• Basic command line / terminal usage", table_cell),
            Paragraph("• Advanced mathematics or calculus<br/>• Deep learning research / paper reproduction<br/>• Transformer architecture internals<br/>• Reinforcement learning expertise", table_cell)
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
            "What is an AI Agent?",
            "Agent loop, LLM vs Agent, ReAct (Think → Act → Observe), workflow vs agent, agent architectures, when not to use an agent.",
            "Build progressively from a simple LLM app to a tool-using ReAct agent. Mini Project: your first functional AI agent."
        ),
        (
            "Week 2",
            "Context Engineering I",
            "Messages, system/user/tool roles, context window, tokenization, prompt architecture, static vs. dynamic context.",
            "Build a context-aware agent and a context builder pipeline; observe how context changes model output."
        ),
        (
            "Week 3",
            "Context Engineering II",
            "Prompt engineering, tool descriptions, prompt injection, defensive prompting, context compression, long conversations.",
            "Project: a production-style customer support agent with business rules and injection defenses — then attack and fix it."
        ),
        (
            "Week 4",
            "Memory Engineering",
            "Short-term vs. long-term memory, episodic vs. semantic memory, memory extraction, retrieval, lifecycle, and conflicts.",
            "Build a personal AI assistant with persistent memory across conversations."
        ),
        (
            "Week 5",
            "RAG Engineering",
            "Chunking, embeddings, vector databases, hybrid search, reranking, metadata filtering, retrieval failure modes.",
            "Build a full retrieval-augmented generation pipeline and compare chunking and retrieval strategies."
        ),
        (
            "Week 6",
            "Tool Engineering",
            "Tool schemas, function calling, tool selection and reliability, error handling, permissions, and security.",
            "Build multiple tools (search, calculator, database, API) and a tool-using research agent."
        ),
        (
            "Week 7",
            "MCP & Production Tooling",
            "MCP concepts, servers and clients, resources, authentication, permissions, and tool discovery.",
            "Connect and register multiple MCP tools with permission controls. Milestone: a personal AI work agent."
        ),
        (
            "Week 8",
            "Coding Agents",
            "Coding agent architecture, repository understanding, code generation, sandboxing, testing, and the agentic coding loop.",
            "Project: a coding agent that inspects a real repository, edits files, runs tests, and fixes errors."
        ),
        (
            "Week 9",
            "Async, Event-Driven & Computer Use",
            "Synchronous vs. asynchronous agents, event-driven architecture, human-in-the-loop, browser automation basics.",
            "Build an event-driven agent triggered by an incoming event, plus a controlled browser-automation mini-lab."
        ),
        (
            "Week 10",
            "Agent Evaluation",
            "Why demos aren't evaluation, benchmarks, trajectory evaluation, LLM-as-judge, reliability, latency, cost, safety.",
            "Build an evaluation framework for your own agent and use it to find and log failure patterns."
        ),
        (
            "Week 11",
            "Agent Improvement",
            "When to improve the prompt, context, tools, or the model itself; version comparison; continuous evolution loop.",
            "Take your Week 10 agent, diagnose failures, and ship an improved Version 2 — then compare results."
        ),
        (
            "Week 12",
            "Multi-Agent Systems & Capstone",
            "Manager-worker and peer-to-peer patterns, shared vs. independent context, delegation, coordination, failure handling.",
            "Capstone: a multi-agent research system (manager, researcher, analyst, critic, synthesizer) — presented and defended."
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

    # 5. Capstone Project
    story.append(Paragraph("Capstone Project — Autonomous Multi-Agent Swarm", h2_style))
    story.append(Paragraph(
        "The final project is not a simple chatbot. Every student builds a complete, production-grade agent system that "
        "synthesizes every capability learned across the 12 weeks into a single, cohesive architecture:",
        body_style
    ))

    capstone_items = [
        "<b>An Agent Router:</b> Directs complex, multi-modal requests dynamically to specialized sub-agents and tool execution planes.",
        "<b>Context Engine & Memory System:</b> Maintains grounded, stateful persona context with persistent episodic and semantic recall.",
        "<b>Tools & MCP Integrations:</b> Executes real-world operations via Model Context Protocol servers and secure API dispatchers.",
        "<b>RAG & Coding Agent Pipeline:</b> Hybrid document search with AST-aware code editing, sandboxed execution, and automated test fixes.",
        "<b>Evaluation & Telemetry Framework:</b> Live benchmark logging of accuracy, token economics, latency, and guardrail violation rates.",
        "<b>Continuous Evolution Cycle:</b> Fully documented diagnostic and improvement cycle transitioning the agent from Version 1 to Version 2."
    ]
    for item in capstone_items:
        story.append(Paragraph(f"• &nbsp; {item}", bullet_style))

    story.append(Paragraph(
        "<b>Portfolio Deliverable:</b> Students graduate with a production GitHub repository featuring architectural diagrams, "
        "evaluation traces (Arize Phoenix / LangSmith), sandboxed integration tests, and a defensible multi-agent deployment.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # 6. Learning Outcomes
    story.append(Paragraph("Graduate Learning Outcomes", h2_style))
    story.append(Paragraph("By the conclusion of this program, students will be verified capable to:", body_style))

    outcomes_col1 = [
        "Design an end-to-end production AI agent architecture",
        "Work with LLM APIs and engineer dynamic context pipelines",
        "Build memory systems and hybrid RAG search indices",
        "Connect external tools and Anthropic MCP servers",
        "Build autonomous coding agents that inspect, test, and repair repos"
    ]
    outcomes_col2 = [
        "Implement asynchronous, event-driven agent workflows",
        "Evaluate agent performance and debug trajectory failures",
        "Optimize multi-agent swarms for cost, latency, and reliability",
        "Apply agent security principles including prompt-injection defense",
        "Deploy, monitor, and continuously improve agents in production"
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
    target = os.path.join(os.path.dirname(__file__), '..', 'public', 'syllabi', 'cs-agentic.pdf')
    build_pdf(target)
