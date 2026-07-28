from fastapi import APIRouter
from pydantic import BaseModel

from app.jd.parser import parse_job_description

router = APIRouter()


class JDRequest(BaseModel):
    job_description: str


@router.post("/parse-jd")
def parse_jd(request: JDRequest):
    """
    Parse Job Description.
    """

    return parse_job_description(
        request.job_description
    )