from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.models.magic_link import MagicLink
from app.schemas.magic_link import MagicLinkCreate


def create_magic_link(db: Session, magic_link: MagicLinkCreate) -> MagicLink:
    """Create a new magic link record."""
    db_magic_link = MagicLink(
        email=magic_link.email,
        secret_token=magic_link.secret_token
    )
    db.add(db_magic_link)
    db.commit()
    db.refresh(db_magic_link)
    return db_magic_link


def get_magic_link_by_token(db: Session, token: str) -> Optional[MagicLink]:
    """Get a magic link by its token."""
    return db.query(MagicLink).filter(MagicLink.secret_token == token).first()


def get_magic_link_by_email_and_token(db: Session, email: str, token: str) -> Optional[MagicLink]:
    """Get a valid magic link by email and token."""
    return db.query(MagicLink).filter(
        MagicLink.email == email,
        MagicLink.secret_token == token,
        MagicLink.used == False,
        MagicLink.expires_at > datetime.utcnow()
    ).first()


def mark_as_used(db: Session, magic_link_id: str) -> None:
    """Mark a magic link as used."""
    db_magic_link = db.query(MagicLink).filter(MagicLink.id == magic_link_id).first()
    if db_magic_link:
        db_magic_link.used = True
        db.commit()


def cleanup_expired_links(db: Session) -> int:
    """Delete expired magic links."""
    expired_links = db.query(MagicLink).filter(
        MagicLink.expires_at < datetime.utcnow()
    )
    count = expired_links.count()
    expired_links.delete()
    db.commit()
    return count