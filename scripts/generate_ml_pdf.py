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
            self.drawString(160, 810, "•   Machine Learning in Production: MLOps Engineering")
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
        self.drawString(145, 24, "— 12-Week Machine Learning in Production MLOps Program")
        
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
        "<font color='#4f46e5'><b>UNISOLE SKILL AI LABS</b></font> &nbsp;•&nbsp; <font color='#64748b'>PATHWAY 03 — PRODUCTION MLOPS</font>",
        ParagraphStyle('Badge', fontName='Helvetica-Bold', fontSize=8, leading=10, spaceAfter=4)
    ))
    story.append(Paragraph("Machine Learning in Production", title_style))
    story.append(Paragraph("MLOps Engineering — A 12-Week Industry-Ready Program", subtitle_style))
    
    # Meta Info Box
    meta_data = [[
        Paragraph("<b>Duration:</b> 12 Weeks (3 Months)", meta_style),
        Paragraph("<b>Total Volume:</b> 132 Contact Hours", meta_style),
        Paragraph("<b>Format:</b> Theory + Hands-on Labs + Capstone", meta_style),
        Paragraph("<b>Level:</b> Production MLOps Engineering", meta_style)
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
        "This program takes students from data engineering fundamentals through experiment tracking, deployment, "
        "monitoring, and automated retraining, into managed cloud ML platforms. Rather than a set of disconnected exercises, "
        "the course follows a <b>single progressive build</b>: each week adds a new capability to a pipeline the student carries forward, "
        "so that by the end of the program every student has a working, monitored, self-retraining ML system deployed on the cloud.",
        body_style
    ))
    story.append(Paragraph(
        "<b>The Industry Learning Cycle:</b> Every topic follows a battle-tested 7-stage learning cycle: "
        "<b>Concept → Architecture → Demonstration → Build → Break → Debug → Evaluate</b>. "
        "This ensures students don't just train a model in a notebook — they understand why production ML systems fail differently, "
        "and how to keep one alive in mission-critical environments.",
        body_style
    ))
    story.append(Spacer(1, 4))

    # 3. Program Structure Table
    story.append(Paragraph("Program Structure & Curriculum Breakdown", h2_style))
    struct_data = [
        [Paragraph("Component", table_header), Paragraph("Hours", table_header), Paragraph("Purpose & Focus", table_header)],
        [Paragraph("Theory / Concepts", table_cell_bold), Paragraph("66 h", table_cell), Paragraph("Understand why production ML fails differently from notebook ML", table_cell)],
        [Paragraph("Hands-on Labs", table_cell_bold), Paragraph("44 h", table_cell), Paragraph("Build and test individual pipeline and infrastructure components", table_cell)],
        [Paragraph("Projects / Capstone", table_cell_bold), Paragraph("18 h", table_cell), Paragraph("Integrate into one deployed, monitored, self-retraining system", table_cell)],
        [Paragraph("Evaluation / Defense", table_cell_bold), Paragraph("4 h", table_cell), Paragraph("Defend architecture choices and operational tradeoffs", table_cell)],
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
        [Paragraph("Required (Pre-Course)", table_header), Paragraph("Not Required (Covered in Program)", table_header)],
        [
            Paragraph("• Python (intermediate — functions, OOP basics)<br/>• SQL fundamentals<br/>• Linux & Git basics<br/>• Basic statistics (self-paced, before Week 1)<br/>• Familiarity with any ML library (sklearn/pandas)", table_cell),
            Paragraph("• Prior deployment or DevOps experience<br/>• Cloud certification<br/>• Distributed systems expertise<br/>• Deep learning research background", table_cell)
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
    story.append(Paragraph("<i>* Note: Students without the required background can take an optional bridge module in Python, SQL, and Linux/Git before the program begins.</i>", ParagraphStyle('Footnote', fontName='Helvetica-Oblique', fontSize=7.5, textColor=colors.HexColor('#64748b'), spaceBefore=2)))
    
    story.append(Spacer(1, 10))

    # 4. Week-by-Week Syllabus (Weeks 1 to 12)
    story.append(Paragraph("Week-by-Week Curriculum (Weeks 1 to 12)", h2_style))

    weeks = [
        (
            "Week 1",
            "Python & Engineering Practices for ML",
            "Writing production-grade Python (packaging, testing, typing), why notebook code fails in production, reproducibility basics, config management.",
            "Convert a notebook prototype into a packaged, tested Python module with a CI-ready project structure."
        ),
        (
            "Week 2",
            "Data Engineering Fundamentals: OLTP vs OLAP",
            "OLTP vs OLAP workloads, why ML needs both, data warehouse vs data lake, columnar storage, intro to DuckDB.",
            "Model a transactional (OLTP) dataset and rebuild it as an analytical (OLAP) schema; run benchmarked analytical queries in DuckDB."
        ),
        (
            "Week 3",
            "ETL Pipelines & Orchestration",
            "ETL vs ELT, pipeline design patterns, scheduling, idempotency, backfills, orchestration concepts (DAGs).",
            "Build a scheduled, idempotent ETL pipeline (extract → transform → load) orchestrated with Airflow/Prefect."
        ),
        (
            "Week 4",
            "Streaming Data with Kafka",
            "Batch vs streaming, Kafka architecture (producers, consumers, topics, partitions), when ML systems need streaming.",
            "Build a Kafka producer/consumer pair simulating real-time events feeding a feature pipeline."
        ),
        (
            "Week 5",
            "Data Labelling & Data Quality",
            "Labelling strategies (manual, weak supervision, active learning), labelling tools (Label Studio, CVAT, Prodigy), inter-annotator agreement, schema/drift validation at ingestion.",
            "Set up a labelling workflow in Label Studio; add automated data-quality checks (Great Expectations) into the Week 3 pipeline."
        ),
        (
            "Week 6",
            "Data Versioning & Feature Stores",
            "Why 'which data trained this model' is a production requirement, DVC/lakeFS concepts, feature stores and train/serve skew.",
            "Version the pipeline's datasets with DVC; build a simple feature store serving consistent features for training and inference."
        ),
        (
            "Week 7",
            "ML Algorithms for Production",
            "Choosing algorithms for production constraints (latency, interpretability, retraining cost) — linear/tree-based models, ensembles, when not to use deep learning.",
            "Build a production-style training pipeline (scikit-learn/XGBoost) with a reusable feature-engineering step, trained on the Week 6 feature store."
        ),
        (
            "Week 8",
            "Experiment Tracking & Model Versioning",
            "Experiment tracking (MLflow/W&B), model registries, model versioning and lineage, reproducible training runs.",
            "Instrument the Week 7 pipeline with MLflow tracking; register the best model with full lineage back to its data version."
        ),
        (
            "Week 9",
            "Model Deployment",
            "Batch vs real-time serving, REST/gRPC model serving, Docker for ML, basic Kubernetes concepts, shadow/canary deployment patterns.",
            "Containerize the registered model behind a FastAPI serving endpoint; deploy with a canary rollout strategy."
        ),
        (
            "Week 10",
            "Monitoring in Production",
            "Data drift vs concept drift, model performance decay, monitoring metrics (latency, throughput, prediction distribution), alerting, ML observability.",
            "Instrument the Week 9 service with drift detection (Evidently AI) and an alerting dashboard."
        ),
        (
            "Week 11",
            "Retraining Pipelines & CI/CD/CT",
            "Continuous training (CT) triggers, automated retraining pipelines, CI/CD for ML (testing data and models, not just code), rollback strategies.",
            "Build an automated retraining pipeline triggered by Week 10 drift alerts, with a CI/CD gate validating the new model before promotion."
        ),
        (
            "Week 12",
            "Cloud ML Services & Capstone",
            "Managed ML platforms — AWS SageMaker, Azure ML, GCP Vertex AI — where to use managed vs self-hosted, cost/tradeoff comparison across the three.",
            "Deploy the full pipeline (or a component) on one managed cloud platform. Capstone: integrate Weeks 1–11 into one deployed, monitored, auto-retraining system on a real dataset — presented and defended."
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
    story.append(Paragraph("Capstone Project — Deployed, Monitored, Auto-Retraining ML System", h2_style))
    story.append(Paragraph(
        "Students synthesize everything learned into an integrated, end-to-end production ML system running on a real dataset:",
        body_style
    ))

    capstone_items = [
        "<b>Full Ingestion & Storage Pipeline:</b> Raw data ingestion via scheduled ETL and streaming Kafka pipelines, validated and stored in OLAP/DuckDB columnar schemas.",
        "<b>Data Quality & Versioning:</b> Automated data quality validations using Great Expectations, with data versions and lineages pinned via DVC.",
        "<b>Model Registry & Lineage:</b> Complete experiment tracking with MLflow, registering models with full lineage from raw data version to trained weights.",
        "<b>Containerized Serving & Canary Rollout:</b> FastAPI microservice containerized in Docker, with canary/shadow routing mechanisms.",
        "<b>Real-Time Drift Observability:</b> Continuous monitoring for data drift and concept drift using Evidently AI with live alert channels.",
        "<b>Automated Retraining & CI/CD/CT:</b> Drift-triggered retraining jobs with automated quality-gate checks before model promotion.",
        "<b>Cloud Deployment:</b> Deployed on at least one major managed cloud platform (AWS SageMaker, Azure ML, or GCP Vertex AI).",
        "<b>Technical Defense:</b> A comprehensive technical report defending architecture decisions and operational trade-offs."
    ]
    for item in capstone_items:
        story.append(Paragraph(f"• &nbsp; {item}", bullet_style))

    story.append(Spacer(1, 8))

    # 6. Learning Outcomes
    story.append(Paragraph("Graduate Learning Outcomes", h2_style))
    story.append(Paragraph("By the conclusion of this program, students will be verified capable to:", body_style))

    outcomes_col1 = [
        "Engineer production-grade data pipelines, both batch and streaming",
        "Distinguish OLTP and OLAP workloads and use DuckDB for analytical queries",
        "Set up data labelling and automated data-quality workflows",
        "Version data and models with full lineage using DVC and a model registry",
        "Choose and train production-appropriate ML algorithms"
    ]
    outcomes_col2 = [
        "Track experiments and manage models through a registry (MLflow/W&B)",
        "Deploy models via containerized APIs with safe rollout patterns (canary/shadow)",
        "Monitor production models for data drift and concept drift",
        "Build automated retraining and CI/CD/CT pipelines with rollback safety",
        "Deploy and compare ML workloads on AWS SageMaker, Azure ML, and GCP Vertex AI"
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
    target_p1 = os.path.join(os.path.dirname(__file__), '..', 'public', 'syllabi', 'cs-p1.pdf')
    target_g1_p1 = os.path.join(os.path.dirname(__file__), '..', 'public', 'syllabi', 'G1-P1 Machine Learning Engineering (Detailed).pdf')
    build_pdf(target_p1)
    shutil.copyfile(target_p1, target_g1_p1)
    print(f"Copied to {target_g1_p1}")
