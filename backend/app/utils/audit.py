from app.models.audit import AuditLog

def log_action(db, actor_email: str, action: str, details: str):
    audit = AuditLog(actor_email=actor_email, action=action, details=details)
    db.add(audit)
    db.commit()
