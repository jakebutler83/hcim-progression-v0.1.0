async function enforceRateLimit(admin, db, key, limit, windowSeconds) {
  const safe=String(key||'anonymous').replace(/[^a-zA-Z0-9:_-]/g,'_').slice(0,180);
  const ref=db.collection('_rateLimits').doc(safe);
  const now=Date.now();
  await db.runTransaction(async tx=>{
    const snap=await tx.get(ref); const data=snap.exists?snap.data():{};
    const start=Number(data.windowStart||0); const count=Number(data.count||0);
    if(start && now-start < windowSeconds*1000 && count>=limit){ const e=new Error('Too many requests. Please wait and try again.'); e.statusCode=429; throw e; }
    if(!start || now-start>=windowSeconds*1000) tx.set(ref,{windowStart:now,count:1,expiresAt:admin.firestore.Timestamp.fromMillis(now+(windowSeconds+3600)*1000)});
    else tx.set(ref,{windowStart:start,count:count+1,expiresAt:admin.firestore.Timestamp.fromMillis(now+(windowSeconds+3600)*1000)},{merge:true});
  });
}
module.exports={enforceRateLimit};
