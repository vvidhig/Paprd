"""Generate a small physics test PDF for pipeline verification."""
import fitz

doc = fitz.open()
texts = [
    "Newton's Laws of Motion. Newton's first law states that an object at rest "
    "stays at rest and an object in motion stays in motion with the same speed "
    "and direction unless acted upon by an unbalanced force. This is also called "
    "the law of inertia. Inertia is the tendency of an object to resist changes "
    "in its state of motion.",
    "Newton's second law states that the acceleration of an object depends on "
    "the mass of the object and the amount of force applied. It is summarized by "
    "the equation F = ma, where F is force in newtons, m is mass in kilograms, "
    "and a is acceleration in meters per second squared.",
    "Newton's third law states that for every action there is an equal and "
    "opposite reaction. When one body exerts a force on a second body, the "
    "second body simultaneously exerts a force equal in magnitude and opposite "
    "in direction on the first body. Examples include rocket propulsion and walking.",
]
for t in texts:
    page = doc.new_page()
    page.insert_textbox(fitz.Rect(50, 50, 550, 750), t, fontsize=12)
doc.save(r"C:\Projects\Paprd\physics_test.pdf")
print("PDF created")
