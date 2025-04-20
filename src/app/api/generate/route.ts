import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "텍스트가 필요합니다." },
        { status: 400 }
      );
    }

    // TODO: 실제 API 호출 로직 구현
    // 임시로 입력된 텍스트를 그대로 반환
    return NextResponse.json({
      result: `입력된 텍스트: ${text}\n\n이 부분에 실제 API 호출 결과가 표시됩니다.`,
    });
  } catch (error) {
    console.error("API 처리 중 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
} 