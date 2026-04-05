import { NextRequest, NextResponse } from "next/server";

const CLOVER_SCL_BASE_URL =
  process.env.CLOVER_SCL_BASE_URL ?? "https://scl-sandbox.dev.clover.com";

interface CheckoutRequestBody {
  token: string;
  amount: number;
  items: Array<{ name: string; price: number; qty: number }>;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Unexpected error";
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("token" in body) ||
    !("amount" in body) ||
    !("items" in body)
  ) {
    return NextResponse.json(
      { success: false, error: "Missing required fields: token, amount, items" },
      { status: 400 }
    );
  }

  const { token, amount, items } = body as CheckoutRequestBody;

  if (typeof token !== "string" || !token.startsWith("clv_")) {
    return NextResponse.json(
      { success: false, error: "Invalid token: must be a clv_ token" },
      { status: 400 }
    );
  }

  if (typeof amount !== "number" || amount <= 0 || !Number.isInteger(amount)) {
    return NextResponse.json(
      { success: false, error: "Invalid amount: must be a positive integer (cents)" },
      { status: 400 }
    );
  }

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { success: false, error: "items must be a non-empty array" },
      { status: 400 }
    );
  }

  const privateKey = process.env.CLOVER_ECOMM_PRIVATE_KEY;
  if (!privateKey) {
    return NextResponse.json(
      { success: false, error: "Payment processing not configured" },
      { status: 503 }
    );
  }

  const idempotencyKey = crypto.randomUUID();
  const clientIp = req.headers.get("x-forwarded-for") ?? "127.0.0.1";

  const orderDescription = items
    .map((item) => `${item.qty}x ${item.name}`)
    .join(", ");

  let cloverRes: Response;
  try {
    cloverRes = await fetch(`${CLOVER_SCL_BASE_URL}/v1/charges`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${privateKey}`,
        "Content-Type": "application/json",
        "idempotency-key": idempotencyKey,
        "x-forwarded-for": clientIp,
      },
      body: JSON.stringify({
        amount,
        currency: "usd",
        source: token,
        ecomind: "ecom",
        description: `Grano de Mostaza order: ${orderDescription}`,
      }),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: `Network error: ${getErrorMessage(err)}` },
      { status: 502 }
    );
  }

  const data = await cloverRes.json();

  if (!cloverRes.ok) {
    const errorMsg: string =
      typeof data?.message === "string" ? data.message : "Charge failed";
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: cloverRes.status }
    );
  }

  return NextResponse.json({ success: true, chargeId: data.id as string });
}
