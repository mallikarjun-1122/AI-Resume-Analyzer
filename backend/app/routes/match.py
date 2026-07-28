from fastapi import APIRouter
from pydantic import BaseModel

from app.jd.parser import parse_job_description
from app.jd.matcher import match_resume_with_jd


router = APIRouter()


class MatchRequest(BaseModel):
    resume: dict
    job_description: str


@router.post("/match")
def match_resume(request: MatchRequest):

    jd = parse_job_description(
        request.job_description
    )

    result = match_resume_with_jd(
        request.resume,
        jd
    )

    return result