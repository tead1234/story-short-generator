"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ApiPage() {
  const [apiKey, setApiKey] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const generateApiKey = () => {
    // 실제로는 서버에서 생성해야 하지만, 예시를 위해 클라이언트에서 생성
    const key = 'sk_' + Array.from(crypto.getRandomValues(new Uint8Array(24)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    setApiKey(key);
    toast.success("API 키가 생성되었습니다!");
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>API 키 발급</CardTitle>
          <CardDescription>
            Story Short Generator API를 사용하기 위한 API 키를 발급받으세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">API 키 설명 (선택사항)</Label>
            <Input
              id="description"
              placeholder="예: 개발용 API 키"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiKey">API 키</Label>
            <div className="flex gap-2">
              <Input
                id="apiKey"
                value={apiKey}
                readOnly
                placeholder="API 키를 생성해주세요"
              />
              <Button
                onClick={() => {
                  if (apiKey) {
                    navigator.clipboard.writeText(apiKey);
                    toast.success("API 키가 클립보드에 복사되었습니다!");
                  }
                }}
                variant="outline"
                disabled={!apiKey}
              >
                복사
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={generateApiKey} className="w-full">
            새 API 키 생성
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 