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
            self.drawString(160, 810, "•   Scientific Machine Learning for Basic Sciences (BSc Physics | BSc Maths)")
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
        self.drawString(145, 24, "— 6-Month Scientific Machine Learning (SciML / PINNs) Program")
        
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
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
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

    # Title & Subtitle
    story.append(Paragraph("Scientific Machine Learning for Basic Sciences", title_style))
    story.append(Paragraph("(BSc Physics | BSc Maths) — A 6-Month Research & Industry-Ready Certificate Program", subtitle_style))
    story.append(Spacer(1, 4))

    # Meta Block
    meta_text = (
        "<b>Duration:</b> 6 Months &nbsp;&nbsp;|&nbsp;&nbsp; "
        "<b>Total:</b> 180+ Hours &nbsp;&nbsp;|&nbsp;&nbsp; "
        "<b>Format:</b> Theory + Computational Labs + Capstone Project<br/>"
        "<b>Target Audience:</b> B.Sc / M.Sc Students in Physics, Mathematics, Statistics, Chemistry & Computational Engineering<br/>"
        "<b>Core Stack:</b> Python, NumPy, SciPy, PyTorch, PINNs, Autograd, ODEs/PDEs, DeepONet, FNO, Google Colab"
    )
    meta_table = Table(
        [[Paragraph(meta_text, meta_style)]],
        colWidths=[515]
    )
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('BORDER', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    # Program Overview
    story.append(Paragraph("Program Overview", h2_style))
    overview_text = (
        "This program is specifically designed for students in basic sciences—particularly <b>Physics and Mathematics</b>—to bridge "
        "the gap between fundamental physical principles and modern artificial intelligence. Rather than treating AI as a black box, "
        "students learn how to integrate scientific physical laws, differential equations, and conservation principles directly into "
        "neural network architectures using <b>Physics-Informed Neural Networks (PINNs)</b> and <b>Neural Operators</b>.<br/><br/>"
        "Students progress methodically from mathematical foundations and scientific computing in Python, through classical numerical methods "
        "and machine learning, into differentiable computing with PyTorch autograd, forward/inverse PINNs, and advanced research capstones. "
        "Every topic follows the rigorous cycle: <i>Physical Law → Mathematical Formulation → Numerical Solver → Differentiable AI → Empirical Validation</i>."
    )
    story.append(Paragraph(overview_text, body_style))
    story.append(Spacer(1, 6))

    # Modules Table
    story.append(Paragraph("Curriculum Breakdown (6 Comprehensive Modules)", h2_style))
    
    modules_data = [
        [
            Paragraph("Module", table_header),
            Paragraph("Core Focus & Competencies", table_header),
            Paragraph("Key Topics & Theory", table_header),
            Paragraph("Hands-on Laboratory Deliverable", table_header)
        ],
        [
            Paragraph("<b>Module 01</b><br/>Foundations", table_cell_bold),
            Paragraph("Mathematical & Computational Foundations for AI", table_cell_bold),
            Paragraph("• Python fundamentals, data structures & scientific Git workflows<br/>• Linear algebra: vectors, matrices, eigenvalues & eigenvectors<br/>• Multivariable calculus: partial derivatives, gradients, Jacobian & Hessian<br/>• Probability, uncertainty quantification & numerical error basics", table_cell),
            Paragraph("Simulate a noisy physical dataset, implement linear regression from scratch using gradient descent, and publish a reproducible Python notebook.", table_cell)
        ],
        [
            Paragraph("<b>Module 02</b><br/>Numerical Computing", table_cell_bold),
            Paragraph("Scientific Computing, Numerical Methods & Differential Equations", table_cell_bold),
            Paragraph("• NumPy vectorization, SciPy routines & data visualization<br/>• Numerical errors, stability, convergence & interpolation<br/>• Numerical ODE solvers: Euler, Runge–Kutta (RK45)<br/>• PDE fundamentals: 1D heat equation, wave equation & finite-difference schemes", table_cell),
            Paragraph("Implement a 1D finite-difference heat-equation solver, generate reference simulation datasets, and benchmark numerical convergence across grid resolutions.", table_cell)
        ],
        [
            Paragraph("<b>Module 03</b><br/>Scientific ML", table_cell_bold),
            Paragraph("Machine Learning for Scientific & Engineering Applications", table_cell_bold),
            Paragraph("• Regression models: regularized linear regression (Lasso/Ridge), polynomial regression<br/>• Classification: logistic regression, decision trees, Random Forest<br/>• Model evaluation: bias-variance trade-off, cross-validation & hyperparameter tuning<br/>• Dimensionality reduction (PCA), feature scaling & scientific baselines", table_cell),
            Paragraph("Build an end-to-end scientific ML pipeline predicting material properties from experimental measurements; deliver an error analysis report.", table_cell)
        ],
        [
            Paragraph("<b>Module 04</b><br/>Deep Learning", table_cell_bold),
            Paragraph("Deep Learning, PyTorch & Differentiable Computing", table_cell_bold),
            Paragraph("• Neural network architectures: perceptrons, activation functions & backpropagation<br/>• Automatic differentiation: PyTorch autograd engine & gradient graphs<br/>• CNNs for spatial physical fields and scientific image data<br/>• Optimization: SGD, Adam, learning rate schedules, and GPU acceleration", table_cell),
            Paragraph("Train a deep neural network to approximate complex non-linear functions; compute high-order analytical derivatives using PyTorch autograd.", table_cell)
        ],
        [
            Paragraph("<b>Module 05</b><br/>SciML & PINNs", table_cell_bold),
            Paragraph("Scientific Machine Learning & Physics-Informed Neural Networks (PINNs)", table_cell_bold),
            Paragraph("• The SciML paradigm: data-driven vs physics-constrained models<br/>• PINN formulation: PDE loss residuals, boundary/initial conditions & collocation points<br/>• Solving forward physical problems: harmonic oscillators and 1D Burgers' equation<br/>• Inverse PINNs: parameter discovery (recovering unknown viscosity/damping from noisy data)", table_cell),
            Paragraph("Formulate and train a PINN for a non-linear differential equation; compare solution accuracy and speed against classical numerical solvers (SciPy/RK45).", table_cell)
        ],
        [
            Paragraph("<b>Module 06</b><br/>Research Capstone", table_cell_bold),
            Paragraph("Advanced Scientific AI, Research Engineering & Industry Capstone", table_cell_bold),
            Paragraph("• Advanced PINN training: adaptive collocation sampling, loss balancing (gradNorm)<br/>• Neural operators: DeepONet and Fourier Neural Operators (FNO) concepts<br/>• Research engineering: experiment tracking, configuration management & modular code<br/>• Scientific technical writing, reproducibility, publication-ready plots & oral viva defense", table_cell),
            Paragraph("Final Capstone Project: End-to-end scientific AI research project with a GitHub repository, benchmark report, poster presentation, and formal project defense.", table_cell)
        ],
    ]

    t = Table(modules_data, colWidths=[65, 120, 185, 145])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e293b')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')])
    ]))
    story.append(t)
    story.append(Spacer(1, 10))

    # Capstone Defense & Outcomes
    story.append(Paragraph("Capstone Defense & Deliverables", h2_style))
    story.append(Paragraph(
        "Every student must complete and defend an independent or paired capstone research project before a review panel. "
        "Example capstone themes include:",
        body_style
    ))
    story.append(Paragraph("• <b>Physics-Informed Fluid Dynamics:</b> Solving 1D Burgers' and Navier-Stokes approximations with PINNs.", bullet_style))
    story.append(Paragraph("• <b>Inverse Parameter Identification:</b> Estimating unknown physical constants from sparse sensor observations.", bullet_style))
    story.append(Paragraph("• <b>Neural Operator Benchmarking:</b> Training Fourier Neural Operators (FNO) to solve parametric partial differential equations.", bullet_style))
    story.append(Paragraph("• <b>Quantum & Chemical Kinetics:</b> Simulating reaction rates and molecular energy surfaces using physics-guided ML.", bullet_style))
    story.append(Spacer(1, 10))

    # Career Roles & Certification
    story.append(Paragraph("Career Pathways & Dual Certification", h2_style))
    story.append(Paragraph(
        "Upon successful completion and defense of the capstone project, students receive an <b>Industry & Research Verified Certificate</b> with unique QR verification. "
        "Graduates are equipped for roles including <b>Scientific AI Researcher</b>, <b>Computational Data Scientist</b>, <b>SciML / PINNs Engineer</b>, <b>Simulation Specialist</b>, and <b>Quantitative Analyst</b> in premier research institutions, aerospace, energy, semiconductor, and quantitative finance sectors.",
        body_style
    ))

    doc.build(story, canvasmaker=NumberedCanvas)

if __name__ == '__main__':
    target_path = os.path.join(os.path.dirname(__file__), '..', 'public', 'syllabi', 'sci-p1.pdf')
    alt_target_path = os.path.join(os.path.dirname(__file__), '..', 'public', 'syllabi', 'G2-P1 Scientific ML & AI for Science (Detailed).pdf')
    
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    build_pdf(target_path)
    shutil.copyfile(target_path, alt_target_path)
    print(f"Generated: {target_path}")
    print(f"Copied to: {alt_target_path}")
